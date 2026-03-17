## Why

CILT（英國皇家物流與運輸學會）台灣分會目前僅作為中華民國物流協會(TALM)網站的子頁面存在，採用傳統 PHP 架構，設計過時、功能有限，無法有效支撐認證推廣、會員服務與協會營運管理。隨著物流產業數位轉型加速，CILT 需要一個獨立的現代化網站來建立品牌權威、提升會員體驗、並實現營運數據化管理。

## What Changes

**全新獨立平台建設（從無到有）：**

- 建立 CILT 台灣分會獨立品牌網站，脫離 TALM 子頁面架構
- 前台：專業形象首頁、組織介紹、認證專區（四級制度）、課程與活動、最新消息、經驗分享、下載專區、考試資訊、聯絡我們
- 會員系統：註冊/登入/密碼重設、會員中心（認證進度追蹤、報名紀錄、繳費紀錄）
- 線上報名與金流：課程報名流程 + 綠界 ECPay 整合（信用卡/ATM/超商）
- 管理後台：Dashboard 數據儀表板、會員 CRM 管理、CMS 內容管理、報名與付費管理
- 電子報訂閱與發送機制
- SEO 優化架構與社群分享支援

## Capabilities

### New Capabilities

- `public-pages`: 前台公開頁面系統 — 首頁、關於協會（國際組織/台灣分會/宗旨）、認證專區（Level 1-4 四級制度、考試資訊、課程大綱）、聯絡我們
- `content-system`: 動態內容管理 — 最新消息、活動資訊、下載專區、經驗分享的前台展示與後台 CRUD 管理
- `member-system`: 會員系統 — 註冊（Email 驗證）、登入/登出（JWT）、忘記密碼、會員中心（個人資料、認證進度、報名紀錄、繳費紀錄）
- `registration-payment`: 線上報名與金流 — 課程/活動報名流程、綠界 ECPay 整合、付款狀態追蹤、收據管理
- `admin-dashboard`: 管理後台 — 數據儀表板、會員管理（CRM）、內容管理（CMS）、報名管理、付費管理、聯絡表單管理
- `design-system`: CILT 品牌設計系統 — 皇家藍+金色色彩體系、響應式佈局、共用元件（導航列、頁尾、卡片、表單）

### Modified Capabilities

（無既有規格需修改 — 此為全新專案）

## Impact

- **新增專案目錄**：`cilt-website/` 下建立完整 Node.js + Express 應用
- **資料庫**：SQLite 資料庫含 13 張資料表（會員、消息、活動、認證、課程、報名、付費、考試、下載、專欄、聯絡、Email 驗證、密碼重設）
- **外部服務依賴**：綠界 ECPay 金流 API、SMTP 郵件服務
- **NPM 套件**：express, better-sqlite3, jsonwebtoken, bcrypt, multer, nodemailer, express-rate-limit, express-validator
- **部署**：獨立 Node.js 伺服器（非 GitHub Pages 靜態部署）
- **現有專案無影響**：與顧問網站完全獨立，不共享程式碼
