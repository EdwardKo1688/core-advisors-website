## Context

CILT 台灣分會需從 TALM 子頁面獨立為完整網站。現有 `cilt-website/` 目錄已有初步 Node.js + Express 骨架（server.js、routes、middleware、db），以及詳細的 SPEC.md 規格書。本設計建立在該基礎上，補充架構決策與實作策略。

核心業務：CILT 四級認證（Level 1-4）的推廣、報名、考試、會員管理。
利害關係人：協會管理者（營運管理）、會員（報名/認證追蹤）、潛在會員（認識 CILT）。

## Goals / Non-Goals

**Goals:**
- 建立專業、權威、國際化的 CILT 品牌網站
- 完整的會員生命週期管理（註冊 → 報名 → 付費 → 認證追蹤）
- 後台營運數據可視化，支撐決策
- SEO 友善架構，提升自然流量
- 響應式設計，支援桌機/平板/手機
- 可獨立部署運作，不依賴 TALM 系統

**Non-Goals:**
- 不做多語系（本階段僅繁體中文 + 必要英文專有名詞）
- 不做即時通訊/線上客服
- 不做線上考試系統（僅考試資訊展示）
- 不做 AI 功能（不同於顧問網站的 AI 診斷）
- 不做 App（PWA 暫不考慮）
- 不做社群論壇

## Decisions

### D1: 架構模式 — Server-Rendered Pages + REST API

**選擇**：Node.js + Express 伺服器端渲染靜態頁面，搭配 REST API 處理動態資料。

**替代方案**：
- SPA（React/Vue）→ 過度工程、SEO 不友善、學習曲線高
- 純靜態 + Google Sheets（如顧問網站）→ 無法支撐會員系統與金流
- Next.js/Nuxt SSR → 引入框架複雜度，團隊不熟悉

**理由**：與現有 cilt-website 骨架一致，SEO 天然友善，技術門檻低，適合協會人員維護。

### D2: 資料庫 — SQLite (better-sqlite3)

**選擇**：嵌入式 SQLite，零配置部署。

**替代方案**：
- PostgreSQL → 需額外伺服器管理
- MySQL → 同上
- MongoDB → 關聯式資料（會員-報名-付費）不適合文件型

**理由**：協會規模（數千會員級別），SQLite 足夠。單檔案備份簡單。未來需要可無縫遷移至 PostgreSQL。

### D3: 認證與安全 — JWT + bcrypt

**選擇**：JWT 存於 HttpOnly Cookie，bcrypt 密碼雜湊。

**理由**：無需 Session Store，適合單伺服器部署。7 天有效期平衡安全與便利。

### D4: 金流 — 綠界 ECPay

**選擇**：綠界科技一站式金流。

**理由**：台灣市場主流，支援信用卡/ATM/超商代碼，API 文件完善，個人/公司皆可申請。

### D5: 設計系統 — CILT 品牌色彩

**色彩體系**：
```
皇家藍 (Royal Blue):  --royal-blue: #003366     ← 主色調，權威
深藍 (Navy):          --navy-dark: #001a33      ← 導航/Footer
金色 (Gold):          --gold: #c8a951           ← 認證/重點
金色亮 (Gold Light):  --gold-light: #d4b96a     ← Hover 狀態
白 (White):           --white: #ffffff          ← 背景
灰 (Gray):            --gray-50 ~ --gray-200    ← 輔助
成功綠:               --success: #10b981
警告橘:               --warning: #f59e0b
錯誤紅:               --danger: #ef4444
```

**字體**：Noto Sans TC（與顧問網站一致） + Playfair Display（英文標題，呼應皇家氣質）

**替代方案**：沿用顧問網站 Navy+Teal → 品牌識別度不足，CILT 應有自己的視覺語言

### D6: 檔案結構

```
cilt-website/
├── server.js                 # Express 入口
├── .env                      # 環境變數
├── package.json
├── db/
│   ├── schema.sql            # 完整 DDL
│   ├── seed.sql              # 初始/展示資料
│   └── database.sqlite       # 自動生成
├── routes/
│   ├── auth.js               # 認證 API
│   ├── members.js            # 會員 API
│   ├── news.js               # 消息 API
│   ├── activities.js         # 活動 API
│   ├── courses.js            # 課程 API
│   ├── registrations.js      # 報名 API
│   ├── payments.js           # 金流 API
│   ├── exams.js              # 考試 API
│   ├── downloads.js          # 下載 API
│   ├── columns.js            # 經驗分享 API
│   ├── contact.js            # 聯絡 API
│   └── admin.js              # 後台管理 API
├── middleware/
│   ├── auth.js               # JWT 驗證
│   ├── upload.js             # 檔案上傳
│   └── validate.js           # 輸入驗證
├── utils/
│   ├── email.js              # 郵件發送
│   ├── ecpay.js              # 綠界串接
│   └── helpers.js            # 工具函式
├── public/
│   ├── index.html            # 首頁
│   ├── about.html            # 關於協會
│   ├── news.html             # 最新消息
│   ├── activities.html       # 活動資訊
│   ├── certification.html    # 認證專區
│   ├── register.html         # 線上報名
│   ├── exam.html             # 考試資訊
│   ├── downloads.html        # 下載專區
│   ├── columns.html          # 經驗分享
│   ├── contact.html          # 聯絡我們
│   ├── login.html            # 登入
│   ├── signup.html           # 註冊
│   ├── forgot-password.html  # 忘記密碼
│   ├── member/               # 會員中心
│   │   ├── dashboard.html
│   │   ├── profile.html
│   │   ├── my-courses.html
│   │   ├── my-certs.html
│   │   └── payments.html
│   ├── admin/                # 管理後台
│   │   └── index.html        # SPA 式後台
│   ├── css/
│   │   └── style.css         # 主樣式表
│   ├── js/
│   │   ├── app.js            # 前台共用邏輯
│   │   ├── api.js            # API 呼叫封裝
│   │   └── admin.js          # 後台 SPA 邏輯
│   ├── images/
│   └── uploads/              # 使用者上傳
└── README.md
```

### D7: 導航架構

**主導航（8+2 項）**：
```
[CILT Logo] ──── 關於協會 | 最新消息 | 活動資訊 | 認證專區 | 線上報名 | 考試資訊 | 下載專區 | 經驗分享 ──── [登入] [註冊]
```

**子導航（Sidebar）**：
- 關於協會：國際組織簡介 / 宗旨 / 台灣分會 / 國際資格承認
- 認證專區：機構簡介 / 認證分級 / 認證比較 / 適合對象 / 課程介紹
- 會員中心：Dashboard / 個人資料 / 我的報名 / 我的認證 / 繳費紀錄

**手機版**：漢堡選單 + 側滑抽屜

### D8: 管理後台 — SPA 模式

**選擇**：單頁 `admin/index.html`，Tab 切換各管理模組。

**模組**：
1. Dashboard（KPI 卡片 + 趨勢圖表）
2. 會員管理（搜尋/篩選/編輯/匯出）
3. 內容管理（消息/活動/下載/專欄 CRUD）
4. 報名管理（狀態追蹤/審核）
5. 付費管理（營收統計/對帳）
6. 聯絡表單（未讀/已讀/回覆標記）

**理由**：避免多頁面切換的延遲，後台使用者為管理員，不需 SEO。

## Risks / Trade-offs

**[SQLite 併發限制]** → 協會規模小（數千會員），寫入頻率低，SQLite WAL 模式足以應對。若未來需要可遷移至 PostgreSQL。

**[單伺服器單點故障]** → 初期可接受。建議定期備份 SQLite 檔案。未來可透過 PM2 + Nginx 強化。

**[綠界 ECPay 測試環境差異]** → 測試環境與正式環境 API 行為可能不同。建議早期完成金流串接測試。

**[會員資料安全]** → 個資法合規風險。緩解：bcrypt 密碼、JWT HttpOnly Cookie、Rate Limiting、輸入驗證、SQL Prepared Statements。

**[內容管理學習曲線]** → 後台 CMS 操作需培訓協會人員。緩解：直覺化 UI + 操作手冊。

**[SEO 冷啟動]** → 新網站 Domain 需要時間建立搜尋排名。緩解：結構化資料(Schema.org)、sitemap.xml、從舊站設置 301 重導向。
