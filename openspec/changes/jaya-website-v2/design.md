## Context

Jaya 城邦國際需要一個全新官方網站，取代現有 jaya.com.tw。核心業務為客服中心解決方案（自有產品線 innoCTI/innoService/innoSales/innoChat + 代理 Genesys Cloud）。

設計方向：麥肯錫風格（McKinsey-style） — 極簡、數據驅動、強排版層次、專業權威感。
目標：支持推廣獲客、服務展示、營運管理三大需求。

## Goals / Non-Goals

**Goals:**
- 麥肯錫風格視覺設計：大留白、強排版、數據導向
- 5 頁精簡結構，每頁 3-4 區塊，10 秒內傳達核心價值
- 純靜態部署（GitHub Pages），零維運成本
- 內容可透過 Google Sheets 後台管理
- 明確的轉換路徑：每頁至少一個 CTA
- 響應式設計（Desktop / Tablet / Mobile）
- SEO 優化（結構化資料、Open Graph、語意化 HTML）

**Non-Goals:**
- 不做會員系統或登入功能
- 不做線上金流/購物車
- 不做多語系（僅繁體中文 + 必要英文品牌名）
- 不做 CMS 後台 UI（直接用 Google Sheets 管理）
- 不做即時通訊/聊天機器人
- 不做部落格/文章系統（洞見文章透過 Google Sheets 管理即可）

## Decisions

### D1: 架構 — 純靜態 HTML/CSS/JS + Google Sheets 後端

**選擇**：與顧問網站相同的技術棧，純靜態前端 + Google Sheets API 動態內容。

**替代方案**：
- Node.js + Express + SQLite → 過度工程，協會規模不需要伺服器
- Next.js / Nuxt SSR → 引入框架複雜度，團隊維護成本高
- WordPress → 需要主機、外掛管理、安全更新

**理由**：GitHub Pages 免費部署、零維運、與現有顧問網站技術一致，團隊已熟悉。Google Sheets 作為輕量 CMS 足以應對新聞/案例的更新頻率。

### D2: 設計風格 — McKinsey 極簡主義

**選擇**：深色主題 + 大留白 + 數據視覺 + 強排版層次。

**設計原則**：
1. **Less is More** — 每個元素必須「earn its place」
2. **數字說話** — 關鍵指標取代冗長文字（如：服務 200+ 企業、98% 滿意度）
3. **視覺呼吸** — 區塊間大間距（80-120px）、段落內適當留白
4. **一頁一重點** — 每頁有一個明確的訊息焦點與行動指引

### D3: 色彩體系 — 深色專業風

```
主色 (Primary):     --primary: #1a1a2e        ← 深藍黑，權威
強調色 (Accent):    --accent: #e2b857         ← 暖金，信任
次強調 (Secondary): --secondary: #16213e      ← 深藍，層次
文字白 (Text):      --text-light: #f0f0f0     ← 深色背景用
文字暗 (Text Dark): --text-dark: #2d2d2d      ← 淺色背景用
背景淺 (BG Light):  --bg-light: #fafafa       ← 內容區背景
背景深 (BG Dark):   --bg-dark: #0d1117        ← Hero/Footer
分隔線:             --border: #e5e5e5         ← 微妙分隔
成功:               --success: #10b981
警告:               --warning: #f59e0b
```

**替代方案**：
- Royal Blue #003366 + Gold #c8a951（CILT 風格）→ 已用於其他專案
- Navy + Teal（顧問網站風格）→ 品牌差異度不足

**理由**：深藍黑+暖金組合兼具科技感與信任感，適合 B2B 企業服務定位。暖金色比冷金更親和，適合台灣市場。

### D4: 字體系統

```
中文標題：Noto Sans TC 700 (Bold)
中文內文：Noto Sans TC 400 (Regular)
英文標題：Inter 700 (Bold) — 現代科技感
英文內文：Inter 400 (Regular)
數字強調：Inter 800 (Extra Bold) — 大數字展示用
```

**字級規範**：
```
Hero 標題:    48px / 56px (Desktop) → 32px / 40px (Mobile)
區塊標題:     36px / 44px → 24px / 32px
副標題:       20px / 28px → 16px / 24px
內文:         16px / 26px → 15px / 24px
小字/標籤:    14px / 20px → 13px / 18px
數據大字:     64px / 72px → 40px / 48px
```

### D5: 頁面結構與導航

**主導航（5+1 項）**：
```
[Jaya Logo] ──── 關於我們 | 產品方案 | 案例洞見 | 聯絡我們 ──── [免費諮詢 CTA]
```

**頁面地圖**：
| 路徑 | 頁面 | 核心訊息 |
|------|------|----------|
| index.html | 首頁 | 「為企業打造世界級客服體驗」 |
| about.html | 關於與服務 | 「我們是誰、做什麼、為什麼選我們」 |
| solutions.html | 產品方案 | 「五大產品線，一站式解決」 |
| cases.html | 案例洞見 | 「用數據證明價值」 |
| contact.html | 聯絡諮詢 | 「開始對話，邁向卓越」 |

**手機版**：漢堡選單 + 全螢幕 Overlay

### D6: 動態內容策略

**Google Sheets 工作表**：
| 工作表 | 用途 | 欄位 |
|--------|------|------|
| cases | 客戶案例 | id, title, client, industry, challenge, result, metrics, image_url, published, date |
| insights | 產業洞見 | id, title, summary, category, link, published, date |
| inquiries | 諮詢表單 | timestamp, name, company, email, phone, service_interest, message |

**載入策略**：
- 首頁：載入最新 3 筆案例摘要
- 案例頁：載入全部已發布案例
- 諮詢表單：POST 至 Google Apps Script Web App

### D7: 檔案結構

```
jaya-website-v2/
├── index.html              # 首頁
├── about.html              # 關於與服務
├── solutions.html          # 產品方案
├── cases.html              # 案例洞見
├── contact.html            # 聯絡諮詢
├── css/
│   ├── style.css           # 主樣式（設計系統 + 頁面樣式）
│   └── responsive.css      # RWD 斷點
├── js/
│   ├── main.js             # 共用邏輯（Navbar、滾動動畫、API）
│   ├── api-config.js       # Google Sheets API 設定
│   └── pages/
│       ├── home.js          # 首頁互動
│       ├── cases.js         # 案例載入/篩選
│       └── contact.js       # 表單驗證/送出
├── images/
│   ├── logo.svg
│   ├── hero/
│   ├── products/
│   └── cases/
├── google-apps-script/
│   └── main.gs             # GAS 後端（表單接收 + Sheets 讀取）
├── sitemap.xml
├── robots.txt
└── README.md
```

### D8: 效能與 SEO

- **效能目標**：Lighthouse Performance > 90
- **載入策略**：關鍵 CSS 內聯、圖片 lazy loading、字體 display:swap
- **SEO**：語意化 HTML5、Schema.org 結構化資料（Organization + Product）、Open Graph / Twitter Card
- **分析**：Google Analytics 4 + Google Search Console

## Risks / Trade-offs

**[Google Sheets API 限額]** → 免費額度每日 300 次讀取。緩解：前端快取 + 靜態化熱門內容。若流量成長可改用 Google Apps Script 代理。

**[靜態網站限制]** → 無伺服器端邏輯。緩解：Google Apps Script 處理表單提交。未來需求成長可逐步加入 Cloudflare Workers。

**[圖片管理]** → 靜態網站無上傳功能。緩解：圖片存於 GitHub repo 或外部圖床（Google Drive / Cloudinary）。

**[內容更新延遲]** → Google Sheets 更新後需等待 API 快取刷新。緩解：設定合理的快取時間（5-15 分鐘）。
