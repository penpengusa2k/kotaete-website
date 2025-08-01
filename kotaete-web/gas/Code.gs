
// --- CONFIGURATION ---
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEET_ID');
const MASTER_SHEET_NAME = 'master';
const CONTACT_SHEET_NAME = 'contact_messages';
const CONTACT_SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('CONTACT_SPREADSHEET_ID');
const NOTIFICATION_EMAIL = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAIL');
const BACKUP_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('BACKUP_FOLDER_ID');
const STATS_SHEET_NAME = 'stats'; // 追加: 統計シート名
const RANKING_SHEET_NAME = 'ranking';

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
      case 'getStats': // 追加: 統計取得アクション
        return createJsonResponse(handleGetStats());
      case 'getRankings':
        return createJsonResponse(handleGetRankings());
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
      case 'like':
        result = handleLike(requestBody.id);
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

// --- GET HANDLERS ---
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

// 追加: 統計情報を取得するハンドラ
function handleGetStats() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let statsSheet = spreadsheet.getSheetByName(STATS_SHEET_NAME);

  if (!statsSheet) {
    // statsシートが存在しない場合、作成し、A1セルに0を設定
    statsSheet = spreadsheet.insertSheet(STATS_SHEET_NAME);
    statsSheet.getRange('A1').setValue(0);
    Logger.log(`Created new stats sheet: ${STATS_SHEET_NAME} and initialized A1 to 0.`);
  }

  const totalCount = statsSheet.getRange('A1').getValue();
  return { result: 'success', totalCreatedCount: totalCount };
}

function handleGetRankings() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const rankingSheet = spreadsheet.getSheetByName(RANKING_SHEET_NAME);
  if (!rankingSheet || rankingSheet.getLastRow() < 2) {
    return { result: 'success', data: { likes: [], responses: [] } };
  }

  const data = rankingSheet.getRange(2, 1, rankingSheet.getLastRow() - 1, 6).getValues();
  
  const likes = [];
  const responses = [];

  data.forEach(row => {
    if (row[0]) { // likes_id が存在すれば
      likes.push({
        id: row[0],
        title: row[1],
        like_count: row[2]
      });
    }
    if (row[3]) { // responses_id が存在すれば
      responses.push({
        id: row[3],
        title: row[4],
        response_count: row[5]
      });
    }
  });

  return { result: 'success', data: { likes, responses } };
}

// --- POST HANDLERS ---
function handleCreate(data) {
  const questions = JSON.parse(data.questions);
  const MAX_OPTIONS = 10;
  for (const question of questions) {
    if (question.type === 'radio' || question.type === 'checkbox') {
      if (question.options && question.options.length > MAX_OPTIONS) {
        throw new Error(`Question '${question.text}' has too many options. Maximum allowed is ${MAX_OPTIONS}.`);
      }
    }
  }
  const masterSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const newRow = [data.id, data.title, data.description, data.result_restricted, data.deadline, new Date(), data.viewing_key, data.anonymous, data.questions, data.creator_name, 0, 0, false, data.result_restricted, false]; // like_count, response_count, is_protected, is_ranking_excluded (閲覧制限で除外), is_in_ranking
  masterSheet.appendRow(newRow);

  // Create a new sheet for responses
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responseSheetName = `responses_${data.id}`;
  // Add respondent_id and timestamp to the headers
  let headers = [];
  if (data.anonymous) {
    headers = ['respondent_id', 'timestamp', ...questions.map((q, i) => `Q${i + 1}. ${q.text}`)];
  } else {
    headers = ['username', 'respondent_id', 'timestamp', ...questions.map((q, i) => `Q${i + 1}. ${q.text}`)];
  }
  spreadsheet.insertSheet(responseSheetName).getRange(1, 1, 1, headers.length).setValues([headers]);

  // 追加: KOTAETEが作成されるたびにstatsシートのカウントを増やす
  const statsSheet = spreadsheet.getSheetByName(STATS_SHEET_NAME);
  if (statsSheet) {
    const currentCount = statsSheet.getRange('A1').getValue();
    statsSheet.getRange('A1').setValue(currentCount + 1);
    Logger.log(`Incremented total created count to ${currentCount + 1}.`);
  } else {
    // statsシートがない場合は作成して初期化
    const newStatsSheet = spreadsheet.insertSheet(STATS_SHEET_NAME);
    newStatsSheet.getRange('A1').setValue(1); // 最初のKOTAETE
    Logger.log(`Created new stats sheet and set initial count to 1.`);
  }

  return { result: 'success', id: data.id };
}

function handleAnswer(data) {
  // --- ADDED: Validate deadline ---
  const masterSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const masterData = masterSheet.getDataRange().getValues();
  const masterHeader = masterData.shift();
  const idCol = masterHeader.indexOf('id');
  const deadlineCol = masterHeader.indexOf('deadline');
  const responseCountCol = masterHeader.indexOf('response_count');

  const surveyRowIndex = masterData.findIndex(row => row[idCol] == data.id);
  if (surveyRowIndex === -1) throw new Error('アンケートが見つかりません。');
  const surveyRow = masterData[surveyRowIndex];

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

  // Increment response count
  const currentResponseCount = surveyRow[responseCountCol] || 0;
  masterSheet.getRange(surveyRowIndex + 2, responseCountCol + 1).setValue(currentResponseCount + 1);

  return { result: 'success' };
}

function handleLike(id) {
  if (!id) throw new Error('Survey ID is required.');

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');
  const likeCountCol = header.indexOf('like_count');

  const surveyRowIndex = data.findIndex(row => row[idCol] == id);
  if (surveyRowIndex === -1) throw new Error('Survey not found.');
  
  const surveyRow = data[surveyRowIndex];
  const currentLikeCount = surveyRow[likeCountCol] || 0;
  const newLikeCount = currentLikeCount + 1;

  sheet.getRange(surveyRowIndex + 2, likeCountCol + 1).setValue(newLikeCount);

  return { result: 'success', like_count: newLikeCount };
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

function updateRankings() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const masterSheet = spreadsheet.getSheetByName(MASTER_SHEET_NAME);
  const data = masterSheet.getDataRange().getValues();
  const header = data.shift();

  const idCol = header.indexOf('id');
  const titleCol = header.indexOf('title');
  const likeCountCol = header.indexOf('like_count');
  const responseCountCol = header.indexOf('response_count');
  const isProtectedCol = header.indexOf('is_protected');
  const isRankingExcludedCol = header.indexOf('is_ranking_excluded');

  const surveys = data.map(row => rowToObject(row, header)).filter(survey => !survey.is_ranking_excluded);

  const topLikes = surveys.sort((a, b) => b.like_count - a.like_count).slice(0, 10);
  const topResponses = surveys.sort((a, b) => b.response_count - a.response_count).slice(0, 10);

  let rankingSheet = spreadsheet.getSheetByName(RANKING_SHEET_NAME);
  if (!rankingSheet) {
    rankingSheet = spreadsheet.insertSheet(RANKING_SHEET_NAME);
  }
  rankingSheet.clear();
  
  // Write Headers
  const rankingHeaders = ['likes_id', 'likes_title', 'likes_count', 'responses_id', 'responses_title', 'responses_count'];
  rankingSheet.getRange(1, 1, 1, 6).setValues([rankingHeaders]);

  // Prepare data rows
  const numRows = Math.max(topLikes.length, topResponses.length);
  const rowsToWrite = [];
  for (let i = 0; i < numRows; i++) {
    const like = topLikes[i];
    const response = topResponses[i];
    rowsToWrite.push([
      like ? like.id : '',
      like ? like.title : '',
      like ? like.like_count : '',
      response ? response.id : '',
      response ? response.title : '',
      response ? response.response_count : ''
    ]);
  }

  // Write data to sheet
  if (rowsToWrite.length > 0) {
    rankingSheet.getRange(2, 1, rowsToWrite.length, 6).setValues(rowsToWrite);
  }

  // Update protected flag in master sheet
  const rankedIds = new Set([...topLikes.map(s => s.id), ...topResponses.map(s => s.id)]);
  for (let i = 0; i < data.length; i++) {
      const surveyId = data[i][idCol];
      if (rankedIds.has(surveyId)) {
          masterSheet.getRange(i + 2, isProtectedCol + 1).setValue(true);
      } else {
          masterSheet.getRange(i + 2, isProtectedCol + 1).setValue(false);
      }
  }
}

function performDailyMaintenance() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const masterSheet = spreadsheet.getSheetByName(MASTER_SHEET_NAME);
  if (!masterSheet) {
    Logger.log('Master sheet not found. Exiting cleanup.');
    return;
  }

  // --- 1. Backup the spreadsheet ---
  let backupSuccessful = false;
  try {
    const backupFolder = DriveApp.getFolderById(BACKUP_FOLDER_ID);
    const spreadsheetFile = DriveApp.getFileById(SPREADSHEET_ID);
    const formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
    const backupFileName = `${formattedDate}_${spreadsheetFile.getName()}_backup`;
    spreadsheetFile.makeCopy(backupFileName, backupFolder);
    Logger.log(`Spreadsheet backed up to folder ${backupFolder.getName()} as ${backupFileName}`);
    backupSuccessful = true;
  } catch (e) {
    Logger.log(`Error during backup: ${e.message}`);
    if (NOTIFICATION_EMAIL) {
      const subject = 'KOTAETE: 重大なエラー - バックアップに失敗しました';
      const body = `
スプレッドシートの自動バックアップ中にエラーが発生しました。

エラーメッセージ: ${e.message}

バックアップが失敗したため、後続のランキング更新および古いアンケートの削除処理は実行されませんでした。
手動で状況を確認してください。
`;
      MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    }
    return; // If backup fails, do NOT proceed.
  }

  // --- Subsequent processes only run if backup was successful ---
  if (backupSuccessful) {
    // --- 2. Update Rankings ---
    try {
      Logger.log('Starting ranking update...');
      updateRankings();
      Logger.log('Ranking update completed successfully.');
    } catch (e) {
      Logger.log(`Error during ranking update: ${e.message}`);
      if (NOTIFICATION_EMAIL) {
        const subject = 'KOTAETE: 警告 - ランキングの更新に失敗しました';
        const body = `
ランキングの自動更新中にエラーが発生しました。

エラーメッセージ: ${e.message}

この後、古いアンケートの削除処理は引き続き実行されますが、ランキングが最新でない可能性がありますのでご確認ください。
`;
        MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
      }
      // Do not stop the process, continue to cleanup.
    }

    // --- 3. Clean up old surveys ---
    Logger.log('Starting cleanup of old surveys...');
    const dataRange = masterSheet.getDataRange();
    const values = dataRange.getValues();
    const header = values[0];
    const surveys = values.slice(1); // Exclude header row

    const idColIndex = header.indexOf('id');
    const deadlineColIndex = header.indexOf('deadline');
    const isProtectedColIndex = header.indexOf('is_protected');

    if (idColIndex === -1 || deadlineColIndex === -1 || isProtectedColIndex === -1) {
      Logger.log('Required columns (id, deadline, or is_protected) not found. Exiting cleanup.');
      return;
    }

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const surveysToDelete = [];
    const rowsToDelete = []; // Store row indices to delete from master sheet

    for (let i = surveys.length - 1; i >= 0; i--) {
      const survey = surveys[i];
      const surveyId = survey[idColIndex];
      const deadline = new Date(survey[deadlineColIndex]);
      const isProtected = survey[isProtectedColIndex];

      if (deadline < sixtyDaysAgo && !isProtected) {
        surveysToDelete.push(surveyId);
        rowsToDelete.push(i + 2); // +2 because of header row and 0-indexed array
      }
    }

    // Delete rows from master sheet
    rowsToDelete.forEach(rowIndex => {
      masterSheet.deleteRow(rowIndex);
      Logger.log(`Deleted row ${rowIndex} from master sheet.`);
    });

    // Delete corresponding response sheets
    surveysToDelete.forEach(surveyId => {
      const responseSheetName = `responses_${surveyId}`;
      const responseSheet = spreadsheet.getSheetByName(responseSheetName);
      if (responseSheet) {
        spreadsheet.deleteSheet(responseSheet);
        Logger.log(`Deleted response sheet: ${responseSheetName}`);
      } else {
        Logger.log(`Response sheet not found for survey ID: ${surveyId}. Skipping deletion.`);
      }
    });

    if (surveysToDelete.length > 0) {
        Logger.log(`Cleanup complete. Deleted ${surveysToDelete.length} old surveys.`);
    } else {
        Logger.log('Cleanup complete. No old surveys to delete.');
    }
  }
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

