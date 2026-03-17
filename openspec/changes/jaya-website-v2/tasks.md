## Tasks

### 1. 設計系統建立

- [x] 1.1 建立 `jaya-website-v2/` 專案目錄結構
- [x] 1.2 建立 `css/style.css` — CSS 變數定義（色彩、字級、間距、動畫）
- [x] 1.3 建立共用元件樣式 — Navbar（深色固定、捲動透明變化）
- [x] 1.4 建立共用元件樣式 — Footer（深色、社群連結、聯絡資訊）
- [x] 1.5 建立共用元件樣式 — CTA 按鈕（主要/次要/幽靈三種）
- [x] 1.6 建立共用元件樣式 — 卡片元件（hover 浮起效果）
- [x] 1.7 建立共用元件樣式 — 區塊標題（金色上橫線裝飾 + 標題 + 副標）
- [x] 1.8 建立 `css/responsive.css` — 三斷點 RWD（1200px / 768px / 480px）
- [x] 1.9 建立 `js/main.js` — 漢堡選單、捲動動畫（Intersection Observer）、回到頂部

### 2. 首頁 (index.html)

- [x] 2.1 Hero 區塊 — 全螢幕深色背景 + 大標題「為企業打造世界級客服體驗」+ 副標 + CTA
- [x] 2.2 數據亮點區塊 — 3-4 個關鍵數字（服務企業數、客戶滿意度、產業經驗年數、專案數）
- [x] 2.3 核心價值區塊 — 三列卡片（顧問諮詢 / 系統整合 / 持續運維）+ 圖示
- [x] 2.4 產品預覽區塊 — 五大產品 Logo/圖示 + 一句話說明 + 連結到產品頁
- [x] 2.5 客戶案例精選 — 動態載入最新 3 筆案例卡片（Google Sheets）
- [x] 2.6 CTA 轉換區塊 — 深色背景 +「開始您的客服升級之旅」+ 諮詢按鈕
- [x] 2.7 Footer

### 3. 關於與服務 (about.html)

- [x] 3.1 Hero 區塊 — 頁面標題 +「我們相信卓越的客服體驗是企業成長的引擎」
- [x] 3.2 企業故事區塊 — 時間線式呈現 Jaya 發展歷程（精煉 3-4 個里程碑）
- [x] 3.3 三大服務線區塊 — 顧問諮詢 / 系統整合 / 運維支持（每項含圖示、標題、3 點說明）
- [x] 3.4 合作夥伴區塊 — Genesys 官方合作夥伴 + 其他認證/夥伴 Logo
- [x] 3.5 團隊展示區塊 — 核心團隊成員（照片 + 職稱 + 一句話專長）
- [x] 3.6 CTA + Footer

### 4. 產品方案 (solutions.html)

- [x] 4.1 Hero 區塊 — 頁面標題 +「五大產品線，一站式解決方案」
- [x] 4.2 產品總覽區塊 — 五大產品的 Tab 或錨點導航
- [x] 4.3 innoCTI 產品卡 — 產品圖、核心功能（3-4 點）、適用場景、CTA
- [x] 4.4 innoService 產品卡 — 同上格式
- [x] 4.5 innoSales 產品卡 — 同上格式
- [x] 4.6 innoChat 產品卡 — 同上格式
- [x] 4.7 Genesys Cloud 專區 — 重點呈現雲端客服平台優勢（4 大特色卡片）
- [x] 4.8 產品比較表 — 功能矩陣或適用場景對照
- [x] 4.9 CTA + Footer

### 5. 案例洞見 (cases.html)

- [x] 5.1 Hero 區塊 — 頁面標題 +「用成果說話」
- [x] 5.2 案例篩選 — 產業別篩選按鈕（全部 / 金融 / 電信 / 零售 / 政府）
- [x] 5.3 案例卡片網格 — 動態載入（Google Sheets），含客戶名、挑戰、成果數據
- [x] 5.4 案例詳情 Modal — 點擊展開完整案例（挑戰→方案→成果數據）
- [x] 5.5 產業洞見區塊 — 文章列表（Google Sheets），含標題、摘要、外部連結
- [x] 5.6 CTA + Footer

### 6. 聯絡諮詢 (contact.html)

- [x] 6.1 Hero 區塊 — 頁面標題 +「開始對話，邁向卓越」
- [x] 6.2 諮詢表單 — 姓名、公司、Email、電話、感興趣服務（下拉）、訊息
- [x] 6.3 表單驗證 — 前端即時驗證 + 送出至 Google Apps Script
- [x] 6.4 聯絡資訊卡片 — 電話、Email、地址、營業時間
- [x] 6.5 Google Maps 嵌入
- [x] 6.6 Footer

### 7. Google Apps Script 後端

- [x] 7.1 建立 Google Sheets — cases / insights / inquiries 三個工作表
- [x] 7.2 建立 GAS Web App — doGet（讀取案例/洞見）+ doPost（接收諮詢表單）
- [x] 7.3 建立 `js/api-config.js` — API URL 設定 + 快取策略
- [x] 7.4 建立前端 API 封裝 — fetch + 錯誤處理 + loading 狀態
- [x] 7.5 表單提交成功/失敗的 UI 回饋

### 8. SEO 與部署

- [x] 8.1 各頁 meta 標籤 — title、description、keywords、Open Graph、Twitter Card
- [ ] 8.2 Schema.org 結構化資料 — Organization + Product
- [x] 8.3 建立 sitemap.xml + robots.txt
- [ ] 8.4 圖片優化 — WebP 格式、適當尺寸、alt 文字
- [ ] 8.5 Lighthouse 效能優化 — 關鍵 CSS 內聯、lazy loading
- [ ] 8.6 GitHub Pages 部署設定
- [ ] 8.7 Google Analytics 4 + Search Console 設定
