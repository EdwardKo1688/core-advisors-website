/**
 * IC 診斷工具 — AI 智慧顧問分析代理
 * ====================================================
 * 功能：
 *   1. 呼叫 Anthropic Claude API 生成診斷分析
 *   2. 將分析結果存入 Google Sheet（報告管理）
 *   3. 發送 Email 給使用者（含完整 AI 分析報告）
 *   4. 通知管理員有新報告生成
 *
 * 部署步驟：
 *   1. 在 Google Apps Script 新建專案，貼入此程式碼
 *   2. 執行 setupSheet() 一次，建立報告記錄 Sheet
 *   3. 前往 Project Settings → Script Properties，設定：
 *      - CLAUDE_API_KEY: 您的 Anthropic API Key
 *      - ADMIN_EMAIL: 管理員 Email（收通知用）
 *      - SHEET_ID: Google Sheet ID（從試算表 URL 複製）
 *   4. 部署 → 新部署 → 類型選「網頁應用程式」
 *      - 執行身分：我
 *      - 存取權：任何人
 *   5. 複製部署 URL → 填入網站的 api-config.js AI_PROXY_URL
 * ====================================================
 */

// === 設定 ===
const CLAUDE_MODEL = 'claude-opus-4-5';    // 或 claude-3-5-sonnet-20241022
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const SHEET_NAME = 'AI分析報告';

/**
 * 處理 POST 請求（主入口）
 */
function doPost(e) {
  const corsHeaders = getCORSHeaders();

  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || 'analyze';

    let result;
    if (action === 'analyze') {
      result = handleAnalyze(body);
    } else if (action === 'email') {
      result = handleEmail(body);
    } else {
      result = { success: false, error: '未知操作' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理 GET 請求（CORS preflight / 健康檢查）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', version: '1.0.0' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 動作：生成 AI 分析
 */
function handleAnalyze(body) {
  const prompt = body.prompt;
  const maxTokens = body.max_tokens || 2000;

  if (!prompt) return { success: false, error: '缺少 prompt' };

  // 呼叫 Claude API
  const content = callClaudeAPI(prompt, maxTokens);

  // 存入 Google Sheet（若有設定 SHEET_ID）
  try {
    saveToSheet({
      timestamp: new Date().toISOString(),
      name: extractField(prompt, '姓名：') || '—',
      company: extractField(prompt, '公司：') || '—',
      role: extractField(prompt, '角色：') || '—',
      score: extractField(prompt, '總分：') || '—',
      level: extractField(prompt, 'Level ') || '—',
      aiContent: content,
      emailSent: false
    });
  } catch (sheetErr) {
    Logger.log('Sheet save error: ' + sheetErr.toString());
    // 不因 Sheet 錯誤中斷主流程
  }

  // 通知管理員
  try {
    const adminEmail = getProperty('ADMIN_EMAIL');
    if (adminEmail) {
      sendAdminNotification(adminEmail, prompt, content);
    }
  } catch (emailErr) {
    Logger.log('Admin email error: ' + emailErr.toString());
  }

  return { success: true, content: content };
}

/**
 * 動作：發送 Email 給使用者
 */
function handleEmail(body) {
  const { email, name, company, role, score, level, aiContent } = body;

  if (!email) return { success: false, error: '缺少 Email' };
  if (!aiContent) return { success: false, error: '缺少 AI 分析內容' };

  const subject = `您的 IC 人才轉型診斷 AI 分析報告 — ${company || '核心顧問'}`;
  const htmlBody = buildEmailHTML({ name, company, role, score, level, aiContent });

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: '核心顧問有限公司'
  });

  // 更新 Sheet 中的 emailSent 欄位
  try {
    markEmailSent(email);
  } catch (err) {
    Logger.log('markEmailSent error: ' + err.toString());
  }

  return { success: true, message: 'Email 已發送' };
}

/**
 * 呼叫 Claude API
 */
function callClaudeAPI(prompt, maxTokens) {
  const apiKey = getProperty('CLAUDE_API_KEY');
  if (!apiKey) throw new Error('未設定 CLAUDE_API_KEY');

  const payload = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  };

  const options = {
    method: 'post',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(CLAUDE_API_URL, options);
  const statusCode = response.getResponseCode();

  if (statusCode !== 200) {
    throw new Error('Claude API 錯誤 ' + statusCode + ': ' + response.getContentText());
  }

  const result = JSON.parse(response.getContentText());

  if (!result.content || !result.content[0]) {
    throw new Error('Claude API 回傳格式異常');
  }

  return result.content[0].text;
}

/**
 * 存入 Google Sheet
 */
function saveToSheet(data) {
  const sheetId = getProperty('SHEET_ID');
  if (!sheetId) return;

  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName(SHEET_NAME) || createSheet(ss);

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.company,
    data.role,
    data.score,
    data.level,
    data.emailSent ? '是' : '否',
    data.aiContent.substring(0, 500) + '...' // 只存前500字
  ]);
}

/**
 * 建立 Sheet 結構
 */
function createSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, 8).setValues([[
    '時間', '姓名', '公司', '角色', '分數', '等級', '已發Email', 'AI分析摘要'
  ]]);
  sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  return sheet;
}

/**
 * 標記 Email 已發送
 */
function markEmailSent(email) {
  // 簡化處理：記錄 email 發送時間
  Logger.log('Email sent to: ' + email);
}

/**
 * 發送管理員通知
 */
function sendAdminNotification(adminEmail, prompt, content) {
  const subject = '【核心顧問】新 AI 診斷報告生成';
  const body = `有新的 IC 診斷 AI 分析報告生成。\n\n` +
    `時間：${new Date().toLocaleString('zh-TW')}\n\n` +
    `分析摘要（前300字）：\n${content.substring(0, 300)}...\n\n` +
    `請登入後台查看完整記錄。`;

  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    body: body,
    name: '核心顧問系統通知'
  });
}

/**
 * 建立 Email HTML 模板
 */
function buildEmailHTML(data) {
  const { name, company, role, score, level, aiContent } = data;

  // 簡易 Markdown → HTML 轉換
  const htmlContent = aiContent
    .replace(/## (.+)/g, '<h3 style="color:#003366;border-bottom:2px solid #e0e8ff;padding-bottom:6px;margin-top:24px">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#003366">$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:6px">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:0 0 12px;line-height:1.7">');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>IC 人才轉型診斷 AI 分析報告</title></head>
<body style="font-family:'Noto Sans TC',Arial,sans-serif;background:#f5f7ff;margin:0;padding:24px">
<div style="max-width:640px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,51,102,0.1)">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#003366,#1a4080);padding:32px;text-align:center">
    <div style="color:#a0c4ff;font-size:0.8rem;letter-spacing:0.1em;margin-bottom:8px">核心顧問有限公司</div>
    <h1 style="color:white;font-size:1.4rem;margin:0 0 8px">IC 人才轉型診斷</h1>
    <div style="color:#c0d8ff;font-size:0.9rem">AI 智慧顧問分析報告</div>
  </div>

  <!-- Meta -->
  <div style="background:#f0f4ff;padding:20px 32px;border-bottom:1px solid #e0e8ff">
    <table style="width:100%;font-size:0.88rem">
      <tr>
        <td style="color:#666;padding:4px 0">受診者</td>
        <td style="font-weight:600;color:#003366">${name || '—'}</td>
        <td style="color:#666;padding:4px 0">公司</td>
        <td style="font-weight:600;color:#003366">${company || '—'}</td>
      </tr>
      <tr>
        <td style="color:#666;padding:4px 0">角色</td>
        <td style="font-weight:600;color:#003366">${role || '—'}</td>
        <td style="color:#666;padding:4px 0">診斷分數</td>
        <td style="font-weight:600;color:#003366">${score || '—'}/100 Level ${level || '—'}</td>
      </tr>
    </table>
  </div>

  <!-- AI Content -->
  <div style="padding:32px;line-height:1.7;color:#2c3e50;font-size:0.92rem">
    <div style="background:#f0f4ff;border-left:4px solid #003366;padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:24px">
      <strong style="color:#003366">🤖 以下為 Claude AI 基於您的診斷數據生成的個人化轉型策略分析</strong>
    </div>
    <p style="margin:0 0 12px;line-height:1.7">${htmlContent}</p>
  </div>

  <!-- CTA -->
  <div style="background:#f8faff;padding:24px 32px;text-align:center;border-top:1px solid #e0e8ff">
    <p style="color:#666;font-size:0.88rem;margin:0 0 16px">想深入了解診斷結果與改善策略？</p>
    <a href="https://edwardko1688.github.io/core-advisors-website/booking.html"
       style="background:#003366;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:0.9rem;display:inline-block">
      預約顧問深度解讀 →
    </a>
  </div>

  <!-- Footer -->
  <div style="padding:16px 32px;text-align:center;color:#999;font-size:0.78rem;border-top:1px solid #eee">
    © 2026 核心顧問有限公司 Core Consultant Ltd. | 此為自動生成報告，請勿直接回覆此信
  </div>
</div>
</body></html>`;
}

/**
 * 從 prompt 中提取欄位值
 */
function extractField(text, fieldName) {
  const regex = new RegExp(fieldName + '([^\\n|]+)');
  const match = text.match(regex);
  return match ? match[1].trim().split('、')[0].split('，')[0] : null;
}

/**
 * 取得 Script Properties
 */
function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * CORS Headers（注意：GAS Web App 無法自訂 response headers）
 * GAS 自動允許跨域存取，此函式保留供參考
 */
function getCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

/**
 * 初始設定：建立 Sheet 結構
 * 執行一次即可
 */
function setupSheet() {
  const sheetId = getProperty('SHEET_ID');
  if (!sheetId) {
    Logger.log('請先在 Script Properties 設定 SHEET_ID');
    return;
  }
  const ss = SpreadsheetApp.openById(sheetId);
  const existing = ss.getSheetByName(SHEET_NAME);
  if (!existing) {
    createSheet(ss);
    Logger.log('Sheet "' + SHEET_NAME + '" 建立完成');
  } else {
    Logger.log('Sheet "' + SHEET_NAME + '" 已存在');
  }
}

/**
 * 測試函式（可在 GAS 編輯器直接執行）
 */
function testClaudeAPI() {
  const testPrompt = '請用一句話介紹你自己。';
  try {
    const result = callClaudeAPI(testPrompt, 100);
    Logger.log('✅ Claude API 連線成功：' + result);
  } catch (err) {
    Logger.log('❌ 錯誤：' + err.toString());
  }
}
