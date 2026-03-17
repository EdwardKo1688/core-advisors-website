# CHANGE-001: Design Document — 全新平台架構設計

## 1. 設計原則

| 原則 | 說明 |
|------|------|
| **願景可感知** | Demo 不是展示功能清單，是讓客戶在 5 分鐘內看見價值 |
| **角色驅動** | 不同角色登入看到不同世界，不是同一個後台加權限過濾 |
| **三色三世界** | 驅・知（藍）、驅・伴（綠）、驅・效（金）各有獨立視覺氛圍 |
| **故事優先** | Demo 資料講述一家真實公司的故事，不是隨機假資料 |
| **極簡維護** | 零依賴、零 build、每檔 < 200 行、清晰目錄結構 |

---

## 2. 系統架構

### 2.1 整體架構圖

```
index.html
  │
  ├── css/
  │   ├── design-system.css     ← 全局設計系統（變數、元件）
  │   ├── layout.css            ← App Shell 佈局
  │   └── pages/                ← 各頁面專屬樣式
  │       ├── login.css
  │       ├── dashboard.css
  │       ├── learn.css
  │       ├── coach.css
  │       └── boost.css
  │
  ├── js/
  │   ├── app.js                ← 應用入口
  │   ├── router.js             ← Hash Router
  │   ├── store.js              ← 狀態管理 + localStorage
  │   ├── components/           ← 共用 UI 元件
  │   │   ├── ui.js             ← 基礎元件 h/icon/badge/btn/card
  │   │   ├── charts.js         ← SVG 圖表引擎
  │   │   ├── modal.js          ← Modal + Drawer + Toast
  │   │   ├── table.js          ← DataTable 元件
  │   │   └── kanban.js         ← Kanban 看板
  │   │
  │   ├── pages/                ← 頁面模組
  │   │   ├── login.js
  │   │   ├── dashboard.js
  │   │   ├── learn/
  │   │   │   ├── index.js      ← 課程目錄
  │   │   │   ├── course.js     ← 課程詳情/學習
  │   │   │   ├── progress.js   ← 學習進度
  │   │   │   └── manage.js     ← 課程管理
  │   │   ├── coach/
  │   │   │   ├── index.js      ← 陪跑中心
  │   │   │   ├── session.js    ← Session 管理
  │   │   │   ├── ai-coach.js   ← AI 教練對話
  │   │   │   └── assessment.js ← 能力評估
  │   │   └── boost/
  │   │       ├── index.js      ← 業績總覽
  │   │       ├── customers.js  ← 客戶管理
  │   │       ├── pipeline.js   ← Pipeline Kanban
  │   │       └── targets.js    ← 業績目標
  │   │
  │   └── data/
  │       └── demo-story.js     ← 芯達科技 Demo 資料
  │
  └── assets/
      ├── logo.svg
      └── icons/
```

### 2.2 模組載入流程

```
瀏覽器載入 index.html
  │
  ├─ 載入 css/design-system.css + layout.css
  │
  └─ <script type="module" src="js/app.js">
       │
       ├─ import Router from './router.js'
       ├─ import Store from './store.js'
       ├─ import { seedDemoStory } from './data/demo-story.js'
       │
       ├─ 初始化 Store（檢查 localStorage）
       ├─ 若無資料 → seedDemoStory()
       ├─ 初始化 Router（註冊所有路由）
       │
       └─ Router.start()
            │
            ├─ 未登入 → 載入 login.js → 渲染登入頁
            └─ 已登入 → 載入 dashboard.js → 渲染首頁
                          │
                          └─ 根據角色渲染不同 Dashboard 內容
```

### 2.3 Router 設計

```javascript
// 路由表
const routes = {
  '/login':              () => import('./pages/login.js'),
  '/dashboard':          () => import('./pages/dashboard.js'),
  '/learn':              () => import('./pages/learn/index.js'),
  '/learn/course/:id':   () => import('./pages/learn/course.js'),
  '/learn/progress':     () => import('./pages/learn/progress.js'),
  '/learn/manage':       () => import('./pages/learn/manage.js'),
  '/coach':              () => import('./pages/coach/index.js'),
  '/coach/session/:id':  () => import('./pages/coach/session.js'),
  '/coach/ai':           () => import('./pages/coach/ai-coach.js'),
  '/coach/assessment':   () => import('./pages/coach/assessment.js'),
  '/boost':              () => import('./pages/boost/index.js'),
  '/boost/customers':    () => import('./pages/boost/customers.js'),
  '/boost/pipeline':     () => import('./pages/boost/pipeline.js'),
  '/boost/targets':      () => import('./pages/boost/targets.js'),
}
```

使用 Dynamic Import（原生 ES Module），瀏覽器按需載入頁面模組。

### 2.4 Store 設計

```javascript
// store.js — 全局狀態管理
const Store = {
  // 狀態
  state: {
    currentUser: null,      // 當前登入用戶
    currentPillar: null,    // 當前支柱 (learn/coach/boost)
  },

  // 資料存取（localStorage 抽象）
  get(collection) {},       // Store.get('customers') → [...]
  set(collection, data) {}, // Store.set('customers', [...])
  find(collection, id) {},  // Store.find('customers', 'uuid-123')
  add(collection, item) {}, // Store.add('customers', {...})
  update(collection, id, patch) {},
  remove(collection, id) {},

  // 事件系統（簡易 pub/sub）
  on(event, callback) {},
  emit(event, data) {},
}
```

---

## 3. 視覺設計系統

### 3.1 色彩系統（更新）

```css
:root {
  /* 品牌主色 */
  --xd-navy:        #0F2744;    /* 深海軍藍（比舊版更深，更有質感） */
  --xd-navy-light:  #1B3A5C;    /* 海軍藍亮色 */
  --xd-accent:      #00B4D8;    /* 科技藍（保留） */

  /* 三支柱色彩 */
  --xd-learn:       #3B82F6;    /* 驅・知 知識藍（更鮮明） */
  --xd-learn-light: #EFF6FF;    /* 驅・知 淺背景 */
  --xd-coach:       #10B981;    /* 驅・伴 成長綠（保留） */
  --xd-coach-light: #ECFDF5;    /* 驅・伴 淺背景 */
  --xd-boost:       #F59E0B;    /* 驅・效 能量金（保留） */
  --xd-boost-light: #FFFBEB;    /* 驅・效 淺背景 */

  /* 語意色彩 */
  --xd-success:     #22C55E;
  --xd-warning:     #EAB308;
  --xd-danger:      #EF4444;
  --xd-info:        #06B6D4;

  /* 中性色階 */
  --xd-gray-50:     #F8FAFC;
  --xd-gray-100:    #F1F5F9;
  --xd-gray-200:    #E2E8F0;
  --xd-gray-300:    #CBD5E1;
  --xd-gray-400:    #94A3B8;
  --xd-gray-500:    #64748B;
  --xd-gray-600:    #475569;
  --xd-gray-700:    #334155;
  --xd-gray-800:    #1E293B;
  --xd-gray-900:    #0F172A;

  /* 功能變數 */
  --xd-bg:          var(--xd-gray-50);
  --xd-surface:     #FFFFFF;
  --xd-text:        var(--xd-gray-800);
  --xd-muted:       var(--xd-gray-500);
  --xd-border:      var(--xd-gray-200);

  /* 圓角 */
  --radius-sm:      6px;
  --radius:         10px;
  --radius-lg:      16px;
  --radius-xl:      24px;

  /* 陰影 */
  --shadow-sm:      0 1px 2px rgba(0,0,0,.05);
  --shadow:         0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06);
  --shadow-md:      0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06);
  --shadow-lg:      0 10px 15px rgba(0,0,0,.1), 0 4px 6px rgba(0,0,0,.05);
  --shadow-xl:      0 20px 25px rgba(0,0,0,.1), 0 10px 10px rgba(0,0,0,.04);

  /* 間距系統（8px 基底） */
  --space-1:        4px;
  --space-2:        8px;
  --space-3:        12px;
  --space-4:        16px;
  --space-5:        20px;
  --space-6:        24px;
  --space-8:        32px;
  --space-10:       40px;
  --space-12:       48px;
  --space-16:       64px;

  /* 佈局 */
  --topbar-h:       64px;
  --content-max-w:  1280px;

  /* 字型 */
  --font-sans:      'Noto Sans TC', 'Inter', system-ui, sans-serif;
  --font-mono:      'JetBrains Mono', 'Fira Code', monospace;
}
```

### 3.2 字型層級

| 元素 | 大小 | 粗細 | 行高 |
|------|------|------|------|
| Display (登入頁標題) | 2.5rem (40px) | 700 | 1.2 |
| H1 (頁面標題) | 1.75rem (28px) | 700 | 1.3 |
| H2 (區塊標題) | 1.25rem (20px) | 600 | 1.4 |
| H3 (卡片標題) | 1rem (16px) | 600 | 1.5 |
| Body | 0.9375rem (15px) | 400 | 1.6 |
| Small | 0.8125rem (13px) | 400 | 1.5 |
| Caption | 0.75rem (12px) | 500 | 1.4 |

### 3.3 元件設計規範

#### Button 系統
```
Primary   → --xd-navy 背景，白字       （主要操作）
Accent    → --xd-accent 背景，白字      （CTA）
Learn     → --xd-learn 背景，白字       （驅・知相關）
Coach     → --xd-coach 背景，白字       （驅・伴相關）
Boost     → --xd-boost 背景，白字       （驅・效相關）
Outline   → 透明背景，border            （次要操作）
Ghost     → 透明背景，無 border          （最低層級）
Danger    → --xd-danger 背景，白字       （刪除/警告）

尺寸：sm (32px高) / md (40px高) / lg (48px高)
圓角：var(--radius)
Hover：brightness 微調 + 微陰影
```

#### Card 系統
```
Standard  → 白底、border、shadow-sm     （一般卡片）
Elevated  → 白底、shadow-md              （重要卡片）
Pillar    → 支柱色 left-border (3px)    （模組相關卡片）
Stat      → 大數字 + 小標籤 + 趨勢箭頭   （KPI 數據卡）
```

#### 支柱視覺氛圍
```
驅・知 LEARN 頁面：
  - Sub-nav 底線色：--xd-learn
  - 卡片 left-border：--xd-learn
  - 背景微色調：--xd-learn-light
  - Icon 圓底色：--xd-learn 10% opacity

驅・伴 COACH 頁面：
  - Sub-nav 底線色：--xd-coach
  - 卡片 left-border：--xd-coach
  - 背景微色調：--xd-coach-light
  - Icon 圓底色：--xd-coach 10% opacity

驅・效 BOOST 頁面：
  - Sub-nav 底線色：--xd-boost
  - 卡片 left-border：--xd-boost
  - 背景微色調：--xd-boost-light
  - Icon 圓底色：--xd-boost 10% opacity
```

---

## 4. 導航架構設計

### 4.1 Top Bar（全局導航）

```
┌──────────────────────────────────────────────────────────────────┐
│  ◉ 芯智驅   │  ■ 總覽  │  🔵 驅・知  │  🟢 驅・伴  │  🟡 驅・效  │  🔔 👤 ▼  │
└──────────────────────────────────────────────────────────────────┘
     Logo         Dashboard    LEARN        COACH        BOOST     通知 用戶

- 當前支柱的 Tab 顯示底線（支柱色）
- Logo 點擊回 Dashboard
- 用戶下拉：個人資料、切換角色（Demo 用）、登出
```

### 4.2 Sub Navigation（支柱內導航）

```
進入 LEARN 後：
┌──────────────────────────────────────────────────────────────────┐
│   📚 課程目錄    📊 我的學習    ⚙ 課程管理                        │
└──────────────────────────────────────────────────────────────────┘
     (active 顯示 --xd-learn 底線)

進入 COACH 後：
┌──────────────────────────────────────────────────────────────────┐
│   🤖 AI 教練    📋 陪跑計畫    📈 能力評估                        │
└──────────────────────────────────────────────────────────────────┘

進入 BOOST 後：
┌──────────────────────────────────────────────────────────────────┐
│   🏢 客戶管理    🔄 Pipeline    🎯 業績目標                       │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 角色權限對應導航

| 導航項目 | Admin | Manager | Trainer | Sales |
|----------|-------|---------|---------|-------|
| 總覽 Dashboard | ✅ | ✅ | ✅ | ✅ |
| 驅・知 課程目錄 | ✅ | ✅ | ✅ | ✅ |
| 驅・知 我的學習 | ✅ | ✅ | ✅ | ✅ |
| 驅・知 課程管理 | ✅ | ✅ | ✅ | ❌ |
| 驅・伴 AI 教練 | ✅ | ✅ | ✅ | ✅ |
| 驅・伴 陪跑計畫 | ✅ | ✅ | ✅ | ✅(自己的) |
| 驅・伴 能力評估 | ✅ | ✅ | ✅ | ✅(自己的) |
| 驅・效 客戶管理 | ✅ | ✅ | ❌ | ✅ |
| 驅・效 Pipeline | ✅ | ✅ | ❌ | ✅ |
| 驅・效 業績目標 | ✅ | ✅ | ✅(查看) | ✅ |

---

## 5. 頁面設計規格

### 5.1 Login Page — 品牌門面

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              深色漸層背景（--xd-navy → 更深）                  │
│                                                              │
│                    ◉ 芯智驅 XinDrive AI                      │
│                                                              │
│              ┌────────────────────────────┐                  │
│              │                            │                  │
│              │     Email                  │                  │
│              │     ┌────────────────────┐ │                  │
│              │     │                    │ │                  │
│              │     └────────────────────┘ │                  │
│              │     Password               │                  │
│              │     ┌────────────────────┐ │                  │
│              │     │                    │ │                  │
│              │     └────────────────────┘ │                  │
│              │                            │                  │
│              │     ┌────────────────────┐ │                  │
│              │     │      登入          │ │                  │
│              │     └────────────────────┘ │                  │
│              │                            │                  │
│              │  ─── 或選擇 Demo 角色 ───  │                  │
│              │                            │                  │
│              │  ┌──────┐┌──────┐┌──────┐ │                  │
│              │  │👔林總監││👨‍💼陳業務││👩‍🏫張教練│ │                  │
│              │  │Manager││Sales ││Trainer│ │                  │
│              │  └──────┘└──────┘└──────┘ │                  │
│              │                            │                  │
│              └────────────────────────────┘                  │
│                                                              │
│         🔵 驅・知    🟢 驅・伴    🟡 驅・效                    │
│                不忘初心，AI倍增                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Dashboard — 角色差異化首頁

#### Manager 視角（林總監）
```
┌─ TopBar ─────────────────────────────────────────────────────┐
│  ◉ 芯智驅  │  ■ 總覽  │  驅・知  │  驅・伴  │  驅・效  │  🔔 👤  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  早安，林志明 👋           芯達科技  │  2026年3月14日          │
│                                                              │
│  ┌────────────┐┌────────────┐┌────────────┐┌────────────┐  │
│  │ 📈 本月營收  ││ 🔄 活躍商機 ││ 📚 學習完成率 ││ 🤝 陪跑進行 │  │
│  │             ││            ││            ││            │  │
│  │  NT$23.5M  ││   18 件    ││   72%      ││   5 組     │  │
│  │  ▲ 12% MoM ││ NT$85M 加權 ││  ▲ 15 pts  ││  12 sessions│ │
│  └────────────┘└────────────┘└────────────┘└────────────┘  │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────┐    │
│  │                        │  │                        │    │
│  │   營收趨勢（折線圖）     │  │   Pipeline 分佈（長條）  │    │
│  │   6 個月趨勢            │  │   各階段商機數量 + 金額   │    │
│  │                        │  │                        │    │
│  └────────────────────────┘  └────────────────────────┘    │
│                                                              │
│  ┌────────────────────────┐  ┌────────────────────────┐    │
│  │                        │  │  📋 最近動態            │    │
│  │   團隊技能雷達（SVG）    │  │                        │    │
│  │   8 維度能力圖          │  │  ● 陳柏翰完成 MEDDIC   │    │
│  │                        │  │    第 3 模組            │    │
│  │                        │  │  ● 商機「TI 車用 MCU」  │    │
│  │                        │  │    進入 Negotiation     │    │
│  │                        │  │  ● 張淑芬完成第 4 次    │    │
│  └────────────────────────┘  │    陪跑 Session         │    │
│                              └────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

#### Sales 視角（陳業務）
```
Dashboard 以「我的」為中心：
- 我的學習進度（當前課程 + 下一步）
- 我的陪跑計畫（教練、下次 Session、行動項目）
- 我的業績（本月目標 vs 實際、我的 Pipeline）
- 我的待辦（到期商機、待完成課程、待回覆）
```

#### Trainer 視角（張教練）
```
Dashboard 以「我的學員」為中心：
- 學員總覽（誰在學什麼、進度如何）
- 我的陪跑計畫（帶的人、Session 排程）
- 課程數據（完課率、評分）
- 學員能力成長曲線
```

### 5.3 LEARN — 驅・知 頁面

#### 課程目錄
```
篩選列：分類（銷售/採購/供應鏈/管理）| 難度 | 排序
展示方式：卡片網格（2-3 列）

每張課程卡片：
┌──────────────────────────────┐
│  ████████████████████ 封面圖  │
│                              │
│  MEDDIC 實戰銷售方法論         │
│  ⭐ 進階 │ 🕐 12 小時 │ 📚 6 模組│
│                              │
│  學習如何運用 MEDDIC 方法論     │
│  系統化評估商機品質...          │
│                              │
│  ████░░░░░░ 45% 進度          │
│  ┌──────────────────────┐    │
│  │    繼續學習 →         │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

#### 課程學習介面
```
左側：模組 / 課堂目錄（手風琴展開）
右側：課程內容（文字/影片/測驗/練習）
底部：上一堂 ← → 下一堂 導航
頂部：進度條
```

### 5.4 COACH — 驅・伴 頁面

#### AI 教練對話介面
```
類似 ChatGPT 的對話式介面，但品牌化：

┌──────────────────────────────────────────────────────────┐
│  🤖 AI 教練 — MEDDIC 實戰練習                             │
│  方法論：MEDDIC  │  場景：客戶拜訪模擬  │  Session #4     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🤖 教練：                                                │
│  ┌──────────────────────────────────────────────┐        │
│  │ 今天我們來練習 MEDDIC 中的 M（Metrics）。      │        │
│  │ 假設你正在拜訪德州儀器的採購經理，              │        │
│  │ 他問你：「你的方案可以幫我們省多少？」          │        │
│  │ 你會怎麼回答？                                 │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  👤 你：                                                  │
│  ┌──────────────────────────────────────────────┐        │
│  │ 根據我們過去服務類似規模客戶的經驗...          │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  🤖 教練：                                                │
│  ┌──────────────────────────────────────────────┐        │
│  │ 不錯的開場！但 MEDDIC 的 Metrics 強調的是       │        │
│  │ 「可量化的商業影響」。試著加入具體數字...        │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  ┌────┐       │
│  │ 輸入你的回答...                       │  │ 送出 │       │
│  └──────────────────────────────────────┘  └────┘       │
└──────────────────────────────────────────────────────────┘
```

#### 能力評估（雷達圖）
```
8 維度：
1. 產品知識  2. 客戶開發  3. 需求挖掘  4. 方案提案
5. 談判技巧  6. 關係管理  7. 市場分析  8. 數位工具

顯示：當前分數 vs 3 個月前 vs 目標，三層雷達疊加
```

### 5.5 BOOST — 驅・效 頁面

#### Pipeline Kanban
```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Lead  │ │Qualified│ │Proposal│ │Negotia.│ │  Won   │
│  3件   │ │  5件   │ │  4件   │ │  3件   │ │  3件   │
│ $2.1M  │ │ $8.5M  │ │ $12M   │ │ $5.2M  │ │ $3.8M  │
├────────┤ ├────────┤ ├────────┤ ├────────┤ ├────────┤
│┌──────┐│ │┌──────┐│ │┌──────┐│ │┌──────┐│ │┌──────┐│
││TI MCU││ ││ADI   ││ ││NXP   ││ ││STM32 ││ ││Renesas││
││$800K ││ ││$2.3M ││ ││$4.5M ││ ││$1.8M ││ ││$1.2M ││
││ 🟡30% ││ ││ 🟢50% ││ ││ 🔵70% ││ ││ 🟣85% ││ ││ ✅100%││
│└──────┘│ │└──────┘│ │└──────┘│ │└──────┘│ │└──────┘│
│        │ │        │ │        │ │        │ │        │
│┌──────┐│ │┌──────┐│ │┌──────┐│ │        │ │        │
││IoT   ││ ││車用   ││ ││...   ││ │        │ │        │
│└──────┘│ │└──────┘│ │└──────┘│ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

#### 業績目標
```
大數字卡片 + 進度條 + 趨勢圖
個人 vs 團隊 切換
月度 / 季度 / 年度 切換
```

---

## 6. RWD 響應式策略

### 斷點

| 名稱 | 寬度 | 佈局 |
|------|------|------|
| Mobile | < 768px | 單欄、漢堡選單、堆疊卡片 |
| Tablet | 768-1024px | 雙欄、精簡導航 |
| Desktop | > 1024px | 完整佈局、三欄 Kanban |

### Mobile 導航
```
Top Bar 收起為：
┌──────────────────────────────────┐
│  ☰  ◉ 芯智驅          🔔  👤   │
└──────────────────────────────────┘

☰ 展開 Drawer：
┌──────────────┐
│  ■ 總覽       │
│  🔵 驅・知    │
│    ├ 課程目錄  │
│    ├ 我的學習  │
│    └ 課程管理  │
│  🟢 驅・伴    │
│    ├ AI 教練   │
│    ├ 陪跑計畫  │
│    └ 能力評估  │
│  🟡 驅・效    │
│    ├ 客戶管理  │
│    ├ Pipeline  │
│    └ 業績目標  │
└──────────────┘
```

---

## 7. 技術決策記錄

| 決策 | 選擇 | 原因 |
|------|------|------|
| 框架 | Vanilla JS ES Modules | 零依賴、零 build、團隊熟悉 |
| 路由 | Hash-based (#/) | 靜態部署兼容、無需伺服器配置 |
| 狀態 | localStorage + Store 抽象 | Demo 足夠、未來可替換為 Supabase |
| 圖表 | Pure SVG | 零依賴、完全可控、輕量 |
| CSS | Custom Design System | 品牌一致性、無框架包袱 |
| Icon | Inline SVG | 零網路請求、可自訂顏色 |
| 部署 | GitHub Pages | 免費、簡單、現有流程 |
