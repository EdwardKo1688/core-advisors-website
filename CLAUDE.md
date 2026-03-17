# 核心顧問網站 - 專案指引

## 專案概述
靜態 HTML/CSS/JS 網站，部署於 GitHub Pages。後端使用 Google Sheets + Google Apps Script。

## 技術架構
- **前端**：純 HTML/CSS/JS，無框架
- **字型**：Noto Sans TC (Google Fonts)
- **CSS 變數**：`--navy-dark: #0a1628`、`--teal: #00d4aa`
- **圖表**：Chart.js 4.4.0 (CDN)
- **後端 API**：Google Apps Script (`google-apps-script/` 目錄)
- **資料庫**：Google Sheets (5 個工作表)
- **Preview Server**：`python3 -m http.server 8080`（定義在 `.claude/launch.json`）

## 頁面結構
| 頁面 | 用途 |
|------|------|
| index.html | 首頁 |
| about.html | 關於我們 |
| services.html | 顧問服務 |
| solutions.html | 解決方案 |
| tools.html | 工具方案 |
| navigator.html | AI 導入診斷入口 |
| assessment.html | 30 題智慧診斷問卷 |
| result.html | 診斷結果報告 |
| booking.html | 預約諮詢（月曆） |
| admin.html | 後台管理 SPA |

## 後台管理
- **登入**：展示模式密碼 `admin`，正式模式透過 GAS API 驗證
- **5 個 Tab**：儀表板、診斷紀錄、預約管理、內容管理、設定
- **Demo 模式**：`api-config.js` 中 `API_ENABLED = false` 時使用內建展示資料

## 開發規範
- 所有頁面 Navbar 的「預約諮詢」按鈕統一連結到 `booking.html`
- 新增頁面時須包含 `api-config.js` 和 `cms-loader.js`
- CMS 動態內容使用 `data-cms="pageId.sectionId"` 屬性

## 自動驗證
每次完成設計或程式碼修改後，**必須執行 `/verify` 進行自動化驗證**，確認：
1. 所有頁面可正常載入（無 JS 錯誤）
2. Navbar 連結正確
3. 互動功能正常（預約流程、後台登入/Tab 切換）
4. RWD 響應式佈局正確
5. 輸出完整驗證報告
