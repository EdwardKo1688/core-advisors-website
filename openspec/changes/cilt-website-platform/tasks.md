## 1. 專案骨架與資料庫

- [x] 1.1 初始化專案結構：確認 package.json 依賴、建立 .env.example、建立完整目錄結構（routes/, middleware/, utils/, public/, public/css/, public/js/, public/images/, public/uploads/, public/member/, public/admin/, db/）
- [x] 1.2 建立 SQLite 資料庫 Schema（db/schema.sql）：13 張資料表（members, news, activities, cert_levels, courses, registrations, payments, exams, downloads, columns_articles, contacts, email_verifications, password_resets）含索引
- [x] 1.3 建立 Seed 資料（db/seed.sql）：4 級認證基本資料、3-5 筆範例消息、3 筆範例活動、2-3 筆範例課程、範例下載檔案、範例經驗分享、1 個管理員帳號
- [x] 1.4 建立 Express 伺服器入口（server.js）：靜態檔案服務、CORS、Rate Limiting、路由掛載、資料庫初始化

## 2. 設計系統與共用元件

- [x] 2.1 建立 CSS 設計系統（public/css/style.css）：CILT 品牌色彩變數（皇家藍/金色）、字體載入（Noto Sans TC + Playfair Display）、排版階層、按鈕/卡片/表單/Tag 元件樣式
- [x] 2.2 建立響應式佈局：3 斷點（Desktop >1100px / Tablet 768-1100px / Mobile <768px）、Grid 系統、容器寬度
- [x] 2.3 建立共用 Header 導航列：毛玻璃效果固定導航、CILT Logo + 8 個主導航連結 + 登入/註冊按鈕、手機版漢堡選單 + 側滑抽屜
- [x] 2.4 建立共用 Footer：協會聯絡資訊、CILT Logo、版權聲明、快速連結、電子報訂閱輸入框
- [x] 2.5 建立共用 Sidebar 子導航元件：可摺疊式選單、依頁面動態顯示子選單
- [x] 2.6 建立麵包屑導航元件
- [x] 2.7 建立認證等級視覺標識：Level 1 銅色 / Level 2 銀色 / Level 3 金色 / Level 4 鉑金色 Badge
- [x] 2.8 建立列印友善樣式（@media print）

## 3. 前台公開頁面

- [x] 3.1 建立首頁（public/index.html）：Hero 區塊（Logo + 標語 + CTA）、組織簡介、四大宗旨卡片、認證等級概覽、最新消息動態載入、近期活動動態載入、加入 CTA
- [x] 3.2 建立關於協會頁面（public/about.html）：Sidebar 切換 4 個子頁面（國際組織/宗旨/台灣分會/資格承認），Tab 式無重新載入切換
- [x] 3.3 建立認證專區頁面（public/certification.html）：Sidebar 切換 5 個子頁面（機構簡介/認證分級/認證比較/適合對象/課程介紹），Level 1-4 卡片式呈現含報考資格
- [x] 3.4 建立考試資訊頁面（public/exam.html）：考試時間表、各級科目、考試形式、考生守則
- [x] 3.5 建立聯絡我們頁面（public/contact.html）：表單（姓名/Email/電話/公司/類別/留言）、前端即時驗證、提交 API 呼叫

## 4. 動態內容頁面與 API

- [x] 4.1 建立消息 API（routes/news.js）：GET /api/news（分頁/分類/搜尋）、GET /api/news/:id
- [x] 4.2 建立最新消息頁面（public/news.html）：列表含日期+分類標籤+標題、分類篩選、搜尋、分頁（10 則/頁）、詳情展示
- [x] 4.3 建立活動 API（routes/activities.js）：GET /api/activities（分頁/分類/日期/搜尋）、GET /api/activities/:id
- [x] 4.4 建立活動資訊頁面（public/activities.html）：縮圖卡片 3x3 Grid、6 種分類篩選、日期篩選、搜尋、分頁（9 則/頁）
- [x] 4.5 建立下載 API（routes/downloads.js）：GET /api/downloads（分頁/分類/搜尋）、GET /api/downloads/:id/file（含會員驗證）
- [x] 4.6 建立下載專區頁面（public/downloads.html）：列表含標題+分類+檔案大小+下載次數、9 大分類篩選、會員限定檔案標記
- [x] 4.7 建立經驗分享 API（routes/columns.js）：GET /api/columns（分頁/分類/搜尋）、GET /api/columns/:id
- [x] 4.8 建立經驗分享頁面（public/columns.html）：卡片含作者照片+姓名+職稱+CILT等級+摘要、企業/學生分類篩選、展開全文
- [x] 4.9 建立考試 API（routes/exams.js）：GET /api/exams
- [x] 4.10 建立聯絡 API（routes/contact.js）：POST /api/contact、郵件通知
- [x] 4.11 建立前台共用 JS（public/js/app.js）：導航互動、Sidebar 切換、分頁/搜尋/篩選共用函式
- [x] 4.12 建立 API 呼叫封裝（public/js/api.js）：fetch wrapper、JWT 自動附帶、錯誤處理

## 5. 會員系統

- [x] 5.1 建立認證中介層（middleware/auth.js）：JWT 驗證、角色檢查（member/admin）
- [x] 5.2 建立輸入驗證中介層（middleware/validate.js）：express-validator 規則
- [x] 5.3 建立郵件工具（utils/email.js）：nodemailer SMTP 設定、驗證信/重設信/通知信模板
- [x] 5.4 建立認證 API（routes/auth.js）：register（含 Email 驗證信）、verify-email、login（JWT 簽發）、logout、forgot-password、reset-password
- [x] 5.5 建立會員 API（routes/members.js）：GET/PUT /api/members/me、PUT /api/members/me/password
- [x] 5.6 建立登入頁面（public/login.html）：Email + 密碼表單、忘記密碼連結
- [x] 5.7 建立註冊頁面（public/signup.html）：7 欄位表單、前端驗證、密碼強度提示
- [x] 5.8 建立忘記密碼頁面（public/forgot-password.html）：Email 輸入、提交後提示
- [x] 5.9 建立會員中心 Dashboard（public/member/dashboard.html）：歡迎訊息、CILT 等級、最近報名、認證進度、繳費提醒
- [x] 5.10 建立個人資料頁面（public/member/profile.html）：查看/編輯基本資料、修改密碼
- [x] 5.11 建立我的報名頁面（public/member/my-courses.html）：報名紀錄列表、狀態標籤、取消未繳費報名
- [x] 5.12 建立我的認證頁面（public/member/my-certs.html）：認證進度時間軸、目前等級、推薦下一級
- [x] 5.13 建立繳費紀錄頁面（public/member/payments.html）：繳費紀錄列表、狀態、收據下載

## 6. 線上報名與金流

- [x] 6.1 建立課程 API（routes/courses.js）：GET /api/courses（分頁/類型/日期/搜尋）、GET /api/courses/:id
- [x] 6.2 建立報名 API（routes/registrations.js）：POST /api/registrations、DELETE /api/registrations/:id、GET /api/registrations/my
- [x] 6.3 建立綠界工具（utils/ecpay.js）：訂單產生、CheckMacValue 計算、回調驗證
- [x] 6.4 建立付費 API（routes/payments.js）：POST /api/payments/create、POST /api/payments/callback、GET /api/payments/return、GET /api/payments/my
- [x] 6.5 建立線上報名頁面（public/register.html）：課程卡片列表、篩選、搜尋、4 步驟報名流程 UI
- [x] 6.6 建立付款結果頁面：成功/失敗/等待付款提示

## 7. 管理後台

- [x] 7.1 建立管理後台 API（routes/admin.js）：Dashboard KPI 彙整、會員 CRUD + 匯出、內容 CRUD（消息/活動/下載/專欄）、報名管理、付費管理、聯絡表單管理
- [x] 7.2 建立檔案上傳中介層（middleware/upload.js）：multer 設定、檔案類型白名單、10MB 大小限制
- [x] 7.3 建立管理後台頁面（public/admin/index.html）：SPA 式 Tab 切換（Dashboard/會員/內容/報名/付費/聯絡）
- [x] 7.4 建立管理後台 JS（public/js/admin.js）：Tab 路由、CRUD 操作、搜尋/篩選、Chart.js 圖表
- [x] 7.5 建立管理後台 CSS：後台專用樣式、表格、表單、統計卡片

## 8. 整合與完善

- [x] 8.1 SEO 優化：所有頁面 meta tags（title/description/og:*）、sitemap.xml、robots.txt
- [x] 8.2 安全性強化：Rate Limiting（登入 10次/15分, API 200次/15分）、輸入 sanitize
- [ ] 8.3 跨頁面整合測試：首頁動態內容載入、會員註冊→登入→報名→付費完整流程、後台 CRUD 全流程
- [ ] 8.4 響應式測試：Desktop/Tablet/Mobile 三斷點所有頁面佈局驗證
- [ ] 8.5 建立 README.md：專案說明、安裝步驟、環境變數說明、部署指南
