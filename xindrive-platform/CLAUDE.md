# 芯智驅 XinDrive AI — Claude Code 專案指引

## 專案概述
芯智驅 XinDrive AI 管理平台，採用 SDD OpenSpec 開發方法論。
IC 產業唯一 AI 驅動的培訓・陪跑・業績倍增管理平台。

## 技術架構
- **前端**：Pure Vanilla JavaScript SPA（零外部依賴、零 build step）
- **路由**：Hash-based SPA Router（`#/path`）+ Dynamic Import
- **字型**：Noto Sans TC + Inter (Google Fonts)
- **後端**：Supabase（PostgreSQL + Auth + REST API）
- **目前模式**：Demo（localStorage），可切換 Supabase 正式模式
- **資料層**：Store 抽象層（get/set/find/query/add/update/remove）
- **圖表**：Pure SVG（lineChart, barChart, radarChart, progressRing）
- **Preview Server**：`python3 -m http.server 8081`（在 src/ 目錄下，定義在 `.claude/launch.json`）

## 目錄結構
```
xindrive-platform/
├── CLAUDE.md
├── openspec/
│   ├── specs/                 ← 系統規格（Source of Truth）
│   └── changes/               ← 變更提案
└── src/
    ├── index.html             ← SPA 主頁面
    ├── css/
    │   ├── design-system.css  ← CSS 變數、Reset、基礎樣式
    │   ├── layout.css         ← Top Bar、Content、RWD
    │   └── pages/             ← 各頁面專屬樣式
    │       ├── login.css
    │       ├── dashboard.css
    │       ├── learn.css
    │       ├── coach.css
    │       └── boost.css
    └── js/
        ├── app.js             ← 主入口（Store init + 路由註冊）
        ├── router.js          ← Hash Router + Auth Guard
        ├── store.js           ← localStorage 抽象層 + 事件系統
        ├── components/
        │   ├── ui.js          ← h(), appShell, statCard, avatar, badge, toast...
        │   ├── charts.js      ← SVG 圖表（line, bar, radar, progressRing）
        │   ├── modal.js       ← Modal + Drawer
        │   ├── table.js       ← DataTable（可排序、可篩選）
        │   └── kanban.js      ← Kanban 看板（原生 Drag API）
        ├── pages/
        │   ├── login.js       ← 登入 + Demo 角色切換
        │   ├── dashboard.js   ← 角色適應 Dashboard（Manager/Sales/Trainer）
        │   ├── learn/
        │   │   ├── index.js   ← 課程目錄（篩選 + 搜尋）
        │   │   ├── course.js  ← 課程詳情（手風琴模組 + 內容區）
        │   │   ├── progress.js ← 學習進度
        │   │   └── manage.js  ← 課程管理（CRUD）
        │   ├── coach/
        │   │   ├── index.js   ← 陪跑計畫列表
        │   │   ├── ai-coach.js ← AI 教練對話介面
        │   │   ├── session.js ← Session 紀錄
        │   │   └── assessment.js ← 能力評估（雷達圖）
        │   └── boost/
        │       ├── index.js   ← 業績總覽（KPI + 圖表）
        │       ├── customers.js ← 客戶管理（DataTable + Drawer）
        │       ├── pipeline.js ← Pipeline Kanban（拖曳）
        │       └── targets.js ← 業績目標（進度環 + 長條圖）
        └── data/
            └── demo-story.js  ← 芯達科技 Demo 資料（12 users, 4 courses, 20 opps...）
```

## 路由表（14 個路由）
| 路由 | 頁面 |
|------|------|
| `/login` | 登入頁 |
| `/dashboard` | 角色適應 Dashboard |
| `/learn` | LEARN 課程目錄 |
| `/learn/course/:id` | 課程詳情 |
| `/learn/progress` | 學習進度 |
| `/learn/manage` | 課程管理 |
| `/coach` | COACH 陪跑計畫 |
| `/coach/ai` | AI 教練對話 |
| `/coach/session/:id` | Session 紀錄 |
| `/coach/assessment` | 能力評估 |
| `/boost` | BOOST 業績總覽 |
| `/boost/customers` | 客戶管理 |
| `/boost/pipeline` | Pipeline Kanban |
| `/boost/targets` | 業績目標 |

## 品牌設計規範
- **主色**：#1B3A5C（深海軍藍）
- **強調色**：#00B4D8（科技藍）
- **驅・知 LEARN**：#3B82F6（知識藍）
- **驅・伴 COACH**：#10B981（成長綠）
- **驅・效 BOOST**：#F59E0B（能量金）

## Demo 模式
- **公司**：芯達科技（SinDa Technology）
- **3 個可切換角色**：
  - 林總監（Manager）：lin@sinda.com — 看全局 KPI + 團隊數據
  - 陳業務（Sales）：chen@sinda.com — 看個人學習/陪跑/業績
  - 張教練（Trainer）：chang@sinda.com — 看學員/課程管理
- **資料**：12 users, 4 courses, 18 modules, 51 lessons, 7 customers, 20 opportunities, 6 coaching sessions
- **localStorage key**：`xindrive_data`（全部資料）、`xindrive_user`（當前用戶）

## 開發注意事項
- 零外部依賴原則：不使用 React/Vue/Angular/Tailwind CDN
- DOM 使用自建 `h(tag, attrs, children)` helper
- 圖表使用 Pure SVG（`components/charts.js`）
- 所有資料操作透過 `Store.get/set/find/query` 抽象層
- Demo 資料由 `seedDemoStory()` 自動填充（首次載入時）
- 頁面模組 export `render()` 回傳 HTML 或 DOM，`mount()` 掛載互動邏輯
- 用戶 name 欄位用 `(user.full_name || user.name)` 確保相容

## 下一步開發優先序
1. 接入 Supabase 後端（Auth + REST API）
2. 新增報表匯出功能
3. PWA 離線支援
4. 即時通知（Supabase Realtime）
