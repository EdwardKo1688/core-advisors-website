/**
 * Jaya 城邦國際 — Google Apps Script Backend
 *
 * Sheets structure:
 * - cases: id, title, client, industry, challenge, result, metrics, published, date
 * - insights: id, title, summary, category, link, published, date
 * - inquiries: timestamp, name, company, email, phone, service_interest, message
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace with actual Sheet ID

function doGet(e) {
  const action = e.parameter.action;

  try {
    if (action === 'cases') {
      return getCases();
    } else if (action === 'insights') {
      return getInsights();
    } else {
      return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.name || !data.company || !data.email) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    saveInquiry(data);
    sendNotification(data);

    return jsonResponse({ success: true, message: 'Inquiry submitted' });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function getCases() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('cases');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const cases = data.slice(1)
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    })
    .filter(c => c.published === true || c.published === 'TRUE')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return jsonResponse({ data: cases });
}

function getInsights() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('insights');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const insights = data.slice(1)
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    })
    .filter(i => i.published === true || i.published === 'TRUE')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return jsonResponse({ data: insights });
}

function saveInquiry(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('inquiries');
  sheet.appendRow([
    new Date().toISOString(),
    data.name || '',
    data.company || '',
    data.email || '',
    data.phone || '',
    data.service_interest || '',
    data.message || ''
  ]);
}

function sendNotification(data) {
  const subject = `[Jaya 網站諮詢] ${data.company} - ${data.name}`;
  const body = `
新的諮詢表單提交：

姓名：${data.name}
公司：${data.company}
Email：${data.email}
電話：${data.phone || '未提供'}
感興趣服務：${data.service_interest || '未選擇'}
訊息：${data.message || '無'}

時間：${new Date().toLocaleString('zh-TW')}
  `.trim();

  MailApp.sendEmail({
    to: 'jaya-service@outlook.com',
    subject: subject,
    body: body
  });
}

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
