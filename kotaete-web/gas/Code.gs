// --- CONFIGURATION ---
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEET_ID');
const MASTER_SHEET_NAME = 'master';
const CONTACT_SHEET_NAME = 'contact_messages';
const CONTACT_SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('CONTACT_SPREADSHEET_ID');
const NOTIFICATION_EMAIL = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAIL');

// Main entry point for GET requests
function doGet(e) {
  try {
    const action = e.parameter.action;
    const id = e.parameter.id;

    switch (action) {
      case 'get':
        return createJsonResponse(handleGetResponse(id));
      case 'results':
        return createJsonResponse(handleResultsResponse(id, e.parameter.viewing_key));
      case 'list':
        throw new Error('List action is no longer supported.');
      default:
        throw new Error('Invalid action specified.');
    }
  } catch (error) {
    return createJsonResponse({ result: 'error', message: error.message });
  }
}

// Main entry point for POST requests
function doPost(e) {
  try {
    const requestBody = JSON.parse(e.postData.contents);
    const action = requestBody.action;
    const data = requestBody.data;

    let result;
    switch (action) {
      case 'create':
        result = handleCreate(data);
        break;
      case 'answer':
        result = handleAnswer(data);
        break;
      case 'contact':
        result = handleContact(data);
        break;
      case 'toggleResultRestricted':
        throw new Error('Toggle public action is no longer supported.');
      case 'updateDeadline':
        throw new Error('Update deadline action is no longer supported.');
      case 'delete':
        throw new Error('Delete action is no longer supported.');
      default:
        throw new Error('Invalid action specified.');
    }
    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({ result: 'error', message: error.message, details: error.stack });
  }
}

// --- GET HANDLERS --
function handleGetResponse(id) {
  if (!id) throw new Error('Survey ID is required.');
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');
  
  const surveyRow = data.find(row => row[idCol] == id);
  if (!surveyRow) throw new Error('Survey not found.');

  const surveyData = rowToObject(surveyRow, header);

  return { result: 'success', data: surveyData };
}

function handleResultsResponse(id, viewingKey) {
  if (!id) throw new Error('Survey ID is required.');
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');
  
  const surveyRow = data.find(row => row[idCol] == id);
  if (!surveyRow) throw new Error('Survey not found.');

  const surveyData = rowToObject(surveyRow, header);

  // If result_restricted, require viewing_key
  if (surveyData.result_restricted) {
      if (!viewingKey) {
          throw new Error('閲覧キーが提供されていません。このKOTAETEの結果は非公開です。');
      }
      if (!validateViewingKey(id, viewingKey)) {
          throw new Error('無効な閲覧キーです。');
      }
  }

  const responseSheetName = `responses_${id}`;
  const responseSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(responseSheetName);
  
  if (!responseSheet) {
    return { result: 'success', data: [] };
  }
  
  const resultsData = responseSheet.getDataRange().getValues();
  return { result: 'success', data: resultsData };
}

function handleListResponse() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  const surveys = data.map(row => rowToObject(row, header));
  return { result: 'success', data: surveys };
}

// --- POST HANDLERS ---
function handleCreate(data) {  const questions = JSON.parse(data.questions);  const MAX_OPTIONS = 10;  for (const question of questions) {    if (question.type === 'radio' || question.type === 'checkbox') {      if (question.options && question.options.length > MAX_OPTIONS) {        throw new Error(`Question '${question.text}' has too many options. Maximum allowed is ${MAX_OPTIONS}.`);      }    }  }  const masterSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const newRow = [data.id, data.title, data.description, data.result_restricted, data.deadline, new Date(), data.viewing_key, data.anonymous, data.questions, data.creator_name];
  masterSheet.appendRow(newRow);


  // Create a new sheet for responses
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responseSheetName = `responses_${data.id}`;
  // Add respondent_id and timestamp to the headers
  let headers = [];
  if (data.anonymous) {
    headers = ['respondent_id', 'timestamp', ...questions.map(q => q.text)];
  } else {
    headers = ['username', 'respondent_id', 'timestamp', ...questions.map(q => q.text)];
  }
  spreadsheet.insertSheet(responseSheetName).getRange(1, 1, 1, headers.length).setValues([headers]);

  return { result: 'success', id: data.id };
}

function handleAnswer(data) {
  // --- ADDED: Validate deadline ---
  const masterSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const masterData = masterSheet.getDataRange().getValues();
  const masterHeader = masterData.shift();
  const idCol = masterHeader.indexOf('id');
  const deadlineCol = masterHeader.indexOf('deadline');

  const surveyRow = masterData.find(row => row[idCol] == data.id);
  if (!surveyRow) throw new Error('アンケートが見つかりません。');

  const deadlineRaw = surveyRow[deadlineCol];
  const deadline = new Date(deadlineRaw);
  const now = new Date();

  if (deadline < now) {
    throw new Error('このKOTAETEは回答期限を過ぎています。');
  }

  const responseSheetName = `responses_${data.id}`;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(responseSheetName);
  if (!sheet) throw new Error('Response sheet not found.');

  // Check for duplicate submission from the same respondent_id
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const respondentColIndex = headerRow.indexOf('respondent_id');
  if (respondentColIndex === -1) {
    throw new Error('respondent_id column not found in response sheet header.');
  }
  const respondentCol = respondentColIndex + 1; // 1-indexed for getRange

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const existingIds = sheet.getRange(2, respondentCol, lastRow - 1, 1).getValues().flat();
    if (existingIds.includes(data.respondent_id)) {
      throw new Error('You have already submitted a response for this survey from this browser.');
    }
  }

  // --- ADDED: Validate answer length ---
  const MAX_ANSWER_LENGTH = 500;
  for (const answer of data.answers) {
    if (typeof answer === 'string' && answer.length > MAX_ANSWER_LENGTH) {
      throw new Error(`One of the answers exceeds the maximum length of ${MAX_ANSWER_LENGTH} characters.`);
    }
  }
  // --- END: Validate answer length ---

  // Add respondent_id and timestamp to the new row
  let newRow = [];
  if (data.username) {
    newRow = [data.username, data.respondent_id, new Date(), ...data.answers];
  } else {
    newRow = [data.respondent_id, new Date(), ...data.answers];
  }
  sheet.appendRow(newRow);
  
  return { result: 'success' };
}

// New handler for contact form submissions
function handleContact(data) {
  const spreadsheet = SpreadsheetApp.openById(CONTACT_SPREADSHEET_ID); // 変更
  let sheet = spreadsheet.getSheetByName(CONTACT_SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONTACT_SHEET_NAME);
    sheet.appendRow(['timestamp', 'name', 'email', 'message']); // ヘッダー行
  }

  const newRow = [new Date(), data.name, data.email, data.message];
  sheet.appendRow(newRow);

  // Send email notification
  if (NOTIFICATION_EMAIL) {
    const subject = 'KOTAETE: 新しいお問い合わせがありました';
    const body = `
新しいお問い合わせが届きました。

お名前: ${data.name}
メールアドレス: ${data.email}
お問い合わせ内容:
${data.message}

スプレッドシートで詳細を確認してください: https://docs.google.com/spreadsheets/d/${CONTACT_SPREADSHEET_ID}/
`;
    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
  }

  return { result: 'success', message: 'お問い合わせを受け付けました。' };
}

// --- UTILITY FUNCTIONS ---

function validateViewingKey(surveyId, key) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');
  const viewingKeyCol = header.indexOf('viewing_key');

  const surveyRow = data.find(row => row[idCol] == surveyId);
  if (!surveyRow) return false; // Survey not found

  return surveyRow[viewingKeyCol] == key;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function rowToObject(row, header) {
  return header.reduce((obj, key, i) => {
    obj[key] = row[i];
    return obj;
  }, {});
}
