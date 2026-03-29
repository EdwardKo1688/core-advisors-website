/**
 * API Configuration
 * Replace the URL below with your deployed Google Apps Script Web App URL
 *
 * Setup steps:
 * 1. Create a new Google Apps Script project
 * 2. Copy Code.gs, Auth.gs, Sheets.gs into the project
 * 3. Run setupSheets() to create sheet structure
 * 4. Run setInitialPassword() to set admin password
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Paste the deployment URL below
 */
var GAS_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL';

// Set to true after configuring the URL above
var API_ENABLED = false;

// ── AI 智慧顧問分析設定 ──────────────────────────────────────
// 步驟：
// 1. 將 google-apps-script/gas-ai-proxy.gs 部署為 GAS Web App
// 2. 在 Script Properties 設定 CLAUDE_API_KEY、ADMIN_EMAIL、SHEET_ID
// 3. 複製 Deployment URL 貼到下方
// 4. 將 AI_ENABLED 改為 true
var AI_PROXY_URL = 'https://script.google.com/macros/s/AKfycbxd1CuGJwxpfPmeRRJ7ZIinsExYGgpTZC1PVPxNM_uR-g9g5s2OjtPhW5H6Q8RD2iaz/exec';
var AI_ENABLED = true;
