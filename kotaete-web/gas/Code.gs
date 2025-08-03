// --- CONFIGURATION ---
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEET_ID');
const MASTER_SHEET_NAME = 'master';
const CONTACT_SHEET_NAME = 'contact_messages';
const CONTACT_SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('CONTACT_SPREADSHEET_ID');
const NOTIFICATION_EMAIL = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAIL');
const BACKUP_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('BACKUP_FOLDER_ID');
const STATS_SHEET_NAME = 'stats';
const RANKING_DAILY_SHEET_NAME = 'ranking_daily';
const RANKING_WEEKLY_SHEET_NAME = 'ranking_weekly';
const COUNT_HISTORY_SHEET_NAME = 'count_history';

// --- GLOBAL SPREADSHEET OBJECTS ---
let mainSpreadsheet = null;
let masterSheet = null;
let statsSheet = null;
let rankingDailySheet = null;
let rankingWeeklySheet = null;
let countHistorySheet = null;

/**
 * Initializes global spreadsheet and sheet objects.
 * This function should be called at the beginning of doGet and doPost.
 */
function initializeSheets() {
  if (mainSpreadsheet === null) {
    mainSpreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  if (masterSheet === null) {
    masterSheet = mainSpreadsheet.getSheetByName(MASTER_SHEET_NAME);
    if (!masterSheet) {
      masterSheet = mainSpreadsheet.insertSheet(MASTER_SHEET_NAME);
      // Assuming master sheet needs a header row if newly created
      masterSheet.appendRow(['id', 'title', 'description', 'result_restricted', 'deadline', 'created_at', 'viewing_key', 'anonymous', 'questions', 'creator_name', 'like_count', 'response_count', 'is_protected', 'is_ranking_excluded', 'is_in_ranking']);
      Logger.log(`Created new master sheet: ${MASTER_SHEET_NAME}`);
    }
  }

  if (statsSheet === null) {
    statsSheet = mainSpreadsheet.getSheetByName(STATS_SHEET_NAME);
    if (!statsSheet) {
      statsSheet = mainSpreadsheet.insertSheet(STATS_SHEET_NAME);
      statsSheet.getRange('A1').setValue(0); // Initialize count
      Logger.log(`Created new stats sheet: ${STATS_SHEET_NAME} and initialized A1 to 0.`);
    }
  }

  if (rankingDailySheet === null) {
    rankingDailySheet = mainSpreadsheet.getSheetByName(RANKING_DAILY_SHEET_NAME);
    if (!rankingDailySheet) {
      rankingDailySheet = mainSpreadsheet.insertSheet(RANKING_DAILY_SHEET_NAME);
      rankingDailySheet.appendRow(['likes_id', 'likes_title', 'likes_count', 'total_likes_count', 'responses_id', 'responses_title', 'responses_count', 'total_responses_count']);
      Logger.log(`Created new daily ranking sheet: ${RANKING_DAILY_SHEET_NAME}`);
    }
  }

  if (rankingWeeklySheet === null) {
    rankingWeeklySheet = mainSpreadsheet.getSheetByName(RANKING_WEEKLY_SHEET_NAME);
    if (!rankingWeeklySheet) {
      rankingWeeklySheet = mainSpreadsheet.insertSheet(RANKING_WEEKLY_SHEET_NAME);
      rankingWeeklySheet.appendRow(['likes_id', 'likes_title', 'likes_count', 'total_likes_count', 'responses_id', 'responses_title', 'responses_count', 'total_responses_count']);
      Logger.log(`Created new weekly ranking sheet: ${RANKING_WEEKLY_SHEET_NAME}`);
    }
  }

  if (countHistorySheet === null) {
    countHistorySheet = mainSpreadsheet.getSheetByName(COUNT_HISTORY_SHEET_NAME);
    if (!countHistorySheet) {
      countHistorySheet = mainSpreadsheet.insertSheet(COUNT_HISTORY_SHEET_NAME);
      countHistorySheet.appendRow(['timestamp', 'survey_id', 'like_count', 'response_count']);
      Logger.log(`Created new count history sheet: ${COUNT_HISTORY_SHEET_NAME}`);
    }
  }
}

// Main entry point for GET requests
function doGet(e) {
  initializeSheets(); // Initialize sheets once per execution
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
      case 'getStats':
        return createJsonResponse(handleGetStats());
      case 'getRankings':
        return createJsonResponse(handleGetRankings(e));
      default:
        throw new Error('Invalid action specified.');
    }
  } catch (error) {
    return createJsonResponse({ result: 'error', message: error.message });
  }
}

// Main entry point for POST requests
function doPost(e) {
  initializeSheets(); // Initialize sheets once per execution
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

  const data = masterSheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');

  const surveyRow = data.find(row => row[idCol] == id);
  if (!surveyRow) throw new Error('Survey not found.');

  const surveyData = rowToObject(surveyRow, header);

  return { result: 'success', data: surveyData };
}

function handleResultsResponse(id, viewingKey) {
  if (!id) throw new Error('Survey ID is required.');

  const data = masterSheet.getDataRange().getValues();
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
  const responseSheet = mainSpreadsheet.getSheetByName(responseSheetName);

  if (!responseSheet) {
    return { result: 'success', data: [] };
  }

  const resultsData = responseSheet.getDataRange().getValues();
  return { result: 'success', data: resultsData };
}

function handleListResponse() {
  const data = masterSheet.getDataRange().getValues();
  const header = data.shift();
  const surveys = data.map(row => rowToObject(row, header));
  return { result: 'success', data: surveys };
}

function handleGetStats() {
  const cache = CacheService.getScriptCache();
  const cachedCount = cache.get('totalCreatedCount');

  if (cachedCount != null) {
    Logger.log('Returning cached totalCreatedCount.');
    return { result: 'success', totalCreatedCount: parseInt(cachedCount) };
  }

  const totalCount = statsSheet.getRange('A1').getValue();
  cache.put('totalCreatedCount', totalCount.toString(), 300); // Cache for 5 minutes (300 seconds)
  Logger.log('Fetched and cached totalCreatedCount.');
  return { result: 'success', totalCreatedCount: totalCount };
}

function handleGetRankings(e) {
  const type = e.parameter.type || 'daily';
  const rankingSheet = type === 'weekly' ? rankingWeeklySheet : rankingDailySheet;

  if (!rankingSheet || rankingSheet.getLastRow() < 2) {
    return { result: 'success', data: { likes: [], responses: [] } };
  }

  const data = rankingSheet.getRange(2, 1, rankingSheet.getLastRow() - 1, 8).getValues();
  
  const likes = [];
  const responses = [];

  data.forEach(row => {
    if (row[0]) {
      likes.push({
        id: row[0],
        title: row[1],
        like_count: row[2],
        total_like_count: row[3]
      });
    }
    if (row[4]) {
      responses.push({
        id: row[4],
        title: row[5],
        response_count: row[6],
        total_response_count: row[7]
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
  const newRow = [data.id, data.title, data.description, data.result_restricted, data.deadline, new Date(), data.viewing_key, data.anonymous, data.questions, data.creator_name, 0, 0, false, data.result_restricted, false];
  masterSheet.appendRow(newRow);

  const responseSheetName = `responses_${data.id}`;
  let headers = [];
  if (data.anonymous) {
    headers = ['respondent_id', 'timestamp', ...questions.map((q, i) => `Q${i + 1}. ${q.text}`)];
  } else {
    headers = ['username', 'respondent_id', 'timestamp', ...questions.map((q, i) => `Q${i + 1}. ${q.text}`)];
  }
  mainSpreadsheet.insertSheet(responseSheetName).getRange(1, 1, 1, headers.length).setValues([headers]);

  const currentCount = statsSheet.getRange('A1').getValue();
  statsSheet.getRange('A1').setValue(currentCount + 1);
  Logger.log(`Incremented total created count to ${currentCount + 1}.`);

  return { result: 'success', id: data.id };
}

function handleAnswer(data) {
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
  const sheet = mainSpreadsheet.getSheetByName(responseSheetName);
  if (!sheet) throw new Error('Response sheet not found.');

  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const respondentColIndex = headerRow.indexOf('respondent_id');
  if (respondentColIndex === -1) {
    throw new Error('respondent_id column not found in response sheet header.');
  }
  const respondentCol = respondentColIndex + 1;

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const existingIds = sheet.getRange(2, respondentCol, lastRow - 1, 1).getValues().flat();
    if (existingIds.includes(data.respondent_id)) {
      throw new Error('You have already submitted a response for this survey from this browser.');
    }
  }

  const MAX_ANSWER_LENGTH = 500;
  for (const answer of data.answers) {
    if (typeof answer === 'string' && answer.length > MAX_ANSWER_LENGTH) {
      throw new Error(`One of the answers exceeds the maximum length of ${MAX_ANSWER_LENGTH} characters.`);
    }
  }

  let newRow = [];
  if (data.username) {
    newRow = [data.username, data.respondent_id, new Date(), ...data.answers];
  } else {
    newRow = [data.respondent_id, new Date(), ...data.answers];
  }
  sheet.appendRow(newRow);

  const currentResponseCount = surveyRow[responseCountCol] || 0;
  masterSheet.getRange(surveyRowIndex + 2, responseCountCol + 1).setValue(currentResponseCount + 1);

  return { result: 'success' };
}

function handleLike(id) {
  if (!id) throw new Error('Survey ID is required.');

  const data = masterSheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');
  const likeCountCol = header.indexOf('like_count');

  const surveyRowIndex = data.findIndex(row => row[idCol] == id);
  if (surveyRowIndex === -1) throw new Error('Survey not found.');
  
  const surveyRow = data[surveyRowIndex];
  const currentLikeCount = surveyRow[likeCountCol] || 0;
  const newLikeCount = currentLikeCount + 1;

  masterSheet.getRange(surveyRowIndex + 2, likeCountCol + 1).setValue(newLikeCount);

  return { result: 'success', like_count: newLikeCount };
}

function handleContact(data) {
  const contactSpreadsheet = SpreadsheetApp.openById(CONTACT_SPREADSHEET_ID);
  let sheet = contactSpreadsheet.getSheetByName(CONTACT_SHEET_NAME);

  if (!sheet) {
    sheet = contactSpreadsheet.insertSheet(CONTACT_SHEET_NAME);
    sheet.appendRow(['timestamp', 'name', 'email', 'message']);
  }

  const newRow = [new Date(), data.name, data.email, data.message];
  sheet.appendRow(newRow);

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

function recordCountsHistory() {
  const masterData = masterSheet.getDataRange().getValues();
  const header = masterData.shift();
  const idCol = header.indexOf('id');
  const likeCountCol = header.indexOf('like_count');
  const responseCountCol = header.indexOf('response_count');

  const timestamp = new Date();
  const rowsToWrite = masterData.map(row => {
    return [timestamp, row[idCol], row[likeCountCol], row[responseCountCol]];
  });

  if (rowsToWrite.length > 0) {
    countHistorySheet.getRange(countHistorySheet.getLastRow() + 1, 1, rowsToWrite.length, 4).setValues(rowsToWrite);
  }
  Logger.log(`Recorded counts for ${rowsToWrite.length} surveys in ${COUNT_HISTORY_SHEET_NAME}.`);
}

function updateRankingsForPeriod(sheetName, days) {
  const masterData = masterSheet.getDataRange().getValues();
  const masterHeader = masterData.shift();

  const idCol = masterHeader.indexOf('id');
  const titleCol = masterHeader.indexOf('title');
  const likeCountCol = masterHeader.indexOf('like_count');
  const responseCountCol = masterHeader.indexOf('response_count');
  const isRankingExcludedCol = masterHeader.indexOf('is_ranking_excluded');

  const now = new Date();
  const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

  const currentSurveys = masterData.filter(row => !row[isRankingExcludedCol])
                                 .map(row => rowToObject(row, masterHeader));

  let historicalData = {};
  if (countHistorySheet) {
    const historyValues = countHistorySheet.getDataRange().getValues();
    const historyHeader = historyValues.shift();
    const histIdCol = historyHeader.indexOf('survey_id');
    const histLikeCol = historyHeader.indexOf('like_count');
    const histResponseCol = historyHeader.indexOf('response_count');
    const histTimestampCol = historyHeader.indexOf('timestamp');

    let closestSnapshot = null;
    let minDiff = Infinity;

    for (let i = historyValues.length - 1; i >= 0; i--) {
        const timestamp = new Date(historyValues[i][histTimestampCol]);
        const diff = Math.abs(timestamp.getTime() - startDate.getTime());
        if (diff < minDiff) {
            minDiff = diff;
            closestSnapshot = historyValues.filter(row => new Date(row[histTimestampCol]).getTime() === timestamp.getTime());
        }
    }
    
    if(closestSnapshot){
      closestSnapshot.forEach(row => {
        const surveyId = row[histIdCol];
        historicalData[surveyId] = {
          like_count: row[histLikeCol] || 0,
          response_count: row[histResponseCol] || 0
        };
      });
    }
  }

  const rankedSurveys = currentSurveys.map(survey => {
    const pastData = historicalData[survey.id] || { like_count: 0, response_count: 0 };
    return {
      id: survey.id,
      title: survey.title,
      like_delta: (survey.like_count || 0) - pastData.like_count,
      response_delta: (survey.response_count || 0) - pastData.response_count,
      total_like_count: survey.like_count || 0,
      total_response_count: survey.response_count || 0
    };
  });

  const topLikes = rankedSurveys.sort((a, b) => b.like_delta - a.like_delta).slice(0, 10);
  const topResponses = rankedSurveys.sort((a, b) => b.response_delta - a.response_delta).slice(0, 10);

  let rankingSheet;
  if (sheetName === RANKING_DAILY_SHEET_NAME) {
    rankingSheet = rankingDailySheet;
  } else if (sheetName === RANKING_WEEKLY_SHEET_NAME) {
    rankingSheet = rankingWeeklySheet;
  } else {
    throw new Error('Invalid sheet name for ranking update.');
  }

  rankingSheet.clear();
  
  const rankingHeaders = ['likes_id', 'likes_title', 'likes_count', 'total_likes_count', 'responses_id', 'responses_title', 'responses_count', 'total_responses_count'];
  rankingSheet.getRange(1, 1, 1, 8).setValues([rankingHeaders]);

  const numRows = Math.max(topLikes.length, topResponses.length);
  const rowsToWrite = [];
  for (let i = 0; i < numRows; i++) {
    const like = topLikes[i];
    const response = topResponses[i];
    rowsToWrite.push([
      like ? like.id : '',
      like ? like.title : '',
      like ? like.like_delta : '',
      like ? like.total_like_count : '',
      response ? response.id : '',
      response ? response.title : '',
      response ? response.response_delta : '',
      response ? response.total_response_count : ''
    ]);
  }

  if (rowsToWrite.length > 0) {
    rankingSheet.getRange(2, 1, rowsToWrite.length, 8).setValues(rowsToWrite);
  }
}

function updateProtectedStatus() {
  const getRankedIdsFromSheet = (sheet) => {
    if (!sheet || sheet.getLastRow() < 2) return new Set();
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    const ids = new Set();
    data.forEach(row => {
      if (row[0]) ids.add(row[0]);
      if (row[3]) ids.add(row[3]);
    });
    return ids;
  };

  const dailyIds = getRankedIdsFromSheet(rankingDailySheet);
  const weeklyIds = getRankedIdsFromSheet(rankingWeeklySheet);
  const rankedIds = new Set([...dailyIds, ...weeklyIds]);

  const masterData = masterSheet.getDataRange().getValues();
  const header = masterData.shift();
  const idCol = header.indexOf('id');
  const isProtectedCol = header.indexOf('is_protected');

  for (let i = 0; i < masterData.length; i++) {
      const surveyId = masterData[i][idCol];
      const isProtected = masterData[i][isProtectedCol];
      const shouldBeProtected = rankedIds.has(surveyId);
      if (isProtected !== shouldBeProtected) {
          masterSheet.getRange(i + 2, isProtectedCol + 1).setValue(shouldBeProtected);
      }
  }
}

function cleanupOldHistory() {
  if (!countHistorySheet || countHistorySheet.getLastRow() < 2) {
    Logger.log('History sheet is empty or not found. No cleanup needed.');
    return;
  }

  const data = countHistorySheet.getDataRange().getValues();
  const header = data.shift();
  const timestampCol = header.indexOf('timestamp');

  if (timestampCol === -1) {
    Logger.log('Timestamp column not found in history sheet. Exiting cleanup.');
    return;
  }

  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const rowsToDelete = [];
  for (let i = data.length - 1; i >= 0; i--) {
    const timestamp = new Date(data[i][timestampCol]);
    if (timestamp < tenDaysAgo) {
      rowsToDelete.push(i + 2);
    }
  }

  rowsToDelete.sort((a, b) => b - a).forEach(rowIndex => {
    countHistorySheet.deleteRow(rowIndex);
  });

  if (rowsToDelete.length > 0) {
    Logger.log(`Cleanup complete. Deleted ${rowsToDelete.length} old history records.`);
  } else {
    Logger.log('Cleanup complete. No old history records to delete.');
  }
}

function performWeeklyMaintenance() {
  try {
    Logger.log('Starting weekly ranking update...');
    updateRankingsForPeriod(RANKING_WEEKLY_SHEET_NAME, 7);
    Logger.log('Weekly ranking update completed successfully.');
  } catch (e) {
    Logger.log(`Error during weekly ranking update: ${e.message}`);
    if (NOTIFICATION_EMAIL) {
      const subject = 'KOTAETE: 警告 - 週間ランキングの更新に失敗しました';
      const body = `週間ランキングの自動更新中にエラーが発生しました.\n\nエラーメッセージ: ${e.message}`;
      MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    }
  }
}

function performDailyMaintenance() {
  initializeSheets(); // Ensure sheets are initialized for maintenance tasks

  if (!masterSheet) {
    Logger.log('Master sheet not found. Exiting cleanup.');
    return;
  }

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
      const body = `\nスプレッドシートの自動バックアップ中にエラーが発生しました。\n\nエラーメッセージ: ${e.message}\n\nバックアップが失敗したため、後続のランキング更新および古いアンケートの削除処理は実行されませんでした。\n手動で状況を確認してください。\n`;
      MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    }
    return;
  }

  if (backupSuccessful) {
    try {
      Logger.log('Starting daily ranking update...');
      updateRankingsForPeriod(RANKING_DAILY_SHEET_NAME, 1);
      Logger.log('Daily ranking update completed successfully.');
    } catch (e) {
      Logger.log(`Error during daily ranking update: ${e.message}`);
      if (NOTIFICATION_EMAIL) {
        const subject = 'KOTAETE: 警告 - 日間ランキングの更新に失敗しました';
        const body = `日間ランキングの自動更新中にエラーが発生しました.\n\nエラーメッセージ: ${e.message}`;
        MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
      }
    }

    const today = new Date();
    if (today.getDay() === 1) {
      performWeeklyMaintenance();
    }

    try {
      Logger.log('Starting to update protected status...');
      updateProtectedStatus();
      Logger.log('Finished updating protected status.');
    } catch (e) {
      Logger.log(`Error during protected status update: ${e.message}`);
       if (NOTIFICATION_EMAIL) {
        const subject = 'KOTAETE: 警告 - 保護ステータスの更新に失敗しました';
        const body = `保護ステータスの更新中にエラーが発生しました。\n\nエラーメッセージ: ${e.message}`;
        MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
      }
    }

    Logger.log('Starting cleanup of old surveys...');
    const dataRange = masterSheet.getDataRange();
    const values = dataRange.getValues();
    const header = values[0];
    const surveys = values.slice(1);

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
    const rowsToDelete = [];

    for (let i = surveys.length - 1; i >= 0; i--) {
      const survey = surveys[i];
      const surveyId = survey[idColIndex];
      const deadline = new Date(survey[deadlineColIndex]);
      const isProtected = survey[isProtectedColIndex];

      if (deadline < sixtyDaysAgo && !isProtected) {
        surveysToDelete.push(surveyId);
        rowsToDelete.push(i + 2);
      }
    }

    rowsToDelete.forEach(rowIndex => {
      masterSheet.deleteRow(rowIndex);
      Logger.log(`Deleted row ${rowIndex} from master sheet.`);
    });

    surveysToDelete.forEach(surveyId => {
      const responseSheetName = `responses_${surveyId}`;
      const responseSheet = mainSpreadsheet.getSheetByName(responseSheetName);
      if (responseSheet) {
        mainSpreadsheet.deleteSheet(responseSheet);
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

    try {
      Logger.log('Starting to record counts history...');
      recordCountsHistory();
      Logger.log('Finished recording counts history.');
    } catch(e) {
       Logger.log(`Error during recording counts history: ${e.message}`);
       if (NOTIFICATION_EMAIL) {
        const subject = 'KOTAETE: 警告 - カウント履歴の記録に失敗しました';
        const body = `カウント履歴の記録中にエラーが発生しました。\n\nエラーメッセージ: ${e.message}`;
        MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
      }
    }

    try {
      Logger.log('Starting to cleanup old history data...');
      cleanupOldHistory();
      Logger.log('Finished cleaning up old history data.');
    } catch(e) {
       Logger.log(`Error during history cleanup: ${e.message}`);
       if (NOTIFICATION_EMAIL) {
        const subject = 'KOTAETE: 警告 - 履歴データのクリーンアップに失敗しました';
        const body = `履歴データのクリーンアップ中にエラーが発生しました。\n\nエラーメッセージ: ${e.message}`;
        MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
      }
    }
  }
}

// --- UTILITY FUNCTIONS ---
function validateViewingKey(surveyId, key) {
  const data = masterSheet.getDataRange().getValues();
  const header = data.shift();
  const idCol = header.indexOf('id');
  const viewingKeyCol = header.indexOf('viewing_key');

  const surveyRow = data.find(row => row[idCol] == surveyId);
  if (!surveyRow) return false;

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