# 芯智驅 XinDrive AI — 系統總規格 v2.0

> CHANGE-001 Platform Redesign 全面更新

## 1. 系統概述

**產品名稱**：芯智驅 XinDrive AI Management Platform
**版本**：2.0.0
**定位**：IC 產業唯一 AI 驅動的培訓・陪跑・業績倍增管理平台
**品牌標語**：不忘初心，AI倍增
**英文定位**：From IC Knowledge to Results — Powered by AI

### 商業模式

三階段遞進模型：

| Phase | 階段 | 時程 | 收費 |
|-------|------|------|------|
| 1 | 培訓（驅・知） | 1-3 月 | 課程授權 $3,000-8,000/人 |
| 2 | 陪跑（驅・伴） | 3-6 月 | 教練服務 $5,000-15,000/月 |
| 3 | 倍增（驅・效） | 6-12 月 | 平台訂閱 $2,000-5,000/月 |

### 目標客群

- Tier 1：大型 IC 通路商（大聯大、文曄、富昌）— 企業級客製
- Tier 2：中型 IC 通路商（世平、品佳、詮鼎）— 標準培訓 + 陪跑
- Tier 3：新興/專業通路商（IoT、車用電子）— 線上課程 + 平台
- IC 原廠業務團隊（TI、ADI、NXP 台灣）— 方法論培訓

## 2. 品牌架構

| 代碼 | 支柱 | 品牌名 | 英文名 | 功能範圍 | 色彩 |
|------|------|--------|--------|----------|------|
| LEARN | 培訓 | 驅・知 | XinDrive Learn | KM 知識管理、課程、評量 | #3B82F6 知識藍 |
| COACH | 陪跑 | 驅・伴 | XinDrive Coach | AI Agent 教練、實戰陪跑 | #10B981 成長綠 |
| BOOST | 倍增 | 驅・效 | XinDrive Boost | 業績追蹤、CRM、效率提升 | #F59E0B 能量金 |

## 3. 技術架構

### 3.1 前端

- **架構**：模組化 SPA（ES Modules，多檔案）
- **路由**：Hash-based SPA Router（`#/path`）
- **UI**：自建 Component System + CSS Design System
- **圖表**：Pure SVG Charts（radar, bar, line, progress）
- **依賴**：零外部框架（Pure Vanilla JavaScript）
- **部署**：GitHub Pages / 任何靜態伺服器

### 3.2 狀態管理

- **Store**：自建全局狀態管理（`store.js`）
- **持久化**：localStorage（Demo 模式）
- **抽象層**：`Store.get/set/find/add/update/remove` API
- **事件系統**：簡易 pub/sub 模式
- **未來擴展**：介面保持不變，底層可替換為 Supabase

### 3.3 後端（規劃中）

- **平台**：Supabase (PostgreSQL + Auth + REST API + Realtime)
- **認證**：Supabase Auth (Email/Password + Magic Link)
- **資料庫**：PostgreSQL via Supabase
- **儲存**：Supabase Storage (教材檔案)
- **目前模式**：Demo（localStorage 完全離線）

### 3.4 部署模式

| 模式 | 資料層 | 認證 | 適用場景 |
|------|--------|------|----------|
| Demo | localStorage + 內建故事資料 | 角色切換選單 | 展示、銷售簡報 |
| Production | Supabase PostgreSQL | Supabase Auth | 正式營運（規劃中）|

## 4. 檔案結構

```
xindrive-platform/src/
├── index.html                  ← 入口（極簡，載入 app.js + CSS）
│
├── css/
│   ├── design-system.css       ← 全局設計系統
│   ├── layout.css              ← App Shell 佈局
│   └── pages/
│       ├── login.css
│       ├── dashboard.css
│       ├── learn.css
│       ├── coach.css
│       └── boost.css
│
├── js/
│   ├── app.js                  ← 應用入口
│   ├── router.js               ← Hash-based SPA Router
│   ├── store.js                ← 狀態管理 + localStorage
│   ├── components/
│   │   ├── ui.js               ← h/icon/badge/btn/card
│   │   ├── charts.js           ← SVG 圖表引擎
│   │   ├── modal.js            ← Modal/Drawer/Toast
│   │   ├── table.js            ← DataTable
│   │   └── kanban.js           ← Kanban 看板
│   ├── pages/
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   ├── learn/              ← 驅・知（4 頁面）
│   │   ├── coach/              ← 驅・伴（4 頁面）
│   │   └── boost/              ← 驅・效（4 頁面）
│   └── data/
│       └── demo-story.js       ← 芯達科技 Demo 資料
│
└── assets/
    ├── logo.svg
    └── icons/
```

## 5. 頁面路由

| 路由 | 頁面 | 支柱 | 權限 |
|------|------|------|------|
| `#/login` | 登入頁 | — | Public |
| `#/dashboard` | 管理儀表板 | — | All Authenticated |
| `#/learn` | 課程目錄 | LEARN | All Authenticated |
| `#/learn/course/:id` | 課程詳情/學習 | LEARN | All Authenticated |
| `#/learn/progress` | 我的學習進度 | LEARN | All Authenticated |
| `#/learn/manage` | 課程管理 | LEARN | Admin, Manager, Trainer |
| `#/coach` | 陪跑中心 | COACH | All Authenticated |
| `#/coach/ai` | AI 教練對話 | COACH | All Authenticated |
| `#/coach/session/:id` | Session 詳情 | COACH | All Authenticated |
| `#/coach/assessment` | 能力評估 | COACH | All Authenticated |
| `#/boost` | 業績總覽 | BOOST | Sales, Manager, Admin |
| `#/boost/customers` | 客戶管理 | BOOST | Sales, Manager, Admin |
| `#/boost/pipeline` | 商機 Pipeline | BOOST | Sales, Manager, Admin |
| `#/boost/targets` | 業績目標 | BOOST | All Authenticated |

## 6. 導航架構

### Top Bar（全局）

```
┌──────────────────────────────────────────────────────────────┐
│  ◉ 芯智驅  │ ■ 總覽 │ 🔵驅・知 │ 🟢驅・伴 │ 🟡驅・效 │ 🔔 👤▼ │
└──────────────────────────────────────────────────────────────┘
```

- Logo 點擊 → `#/dashboard`
- 當前支柱顯示底線（支柱色）
- 用戶下拉：切換角色（Demo）、登出

### Sub Navigation（支柱內）

```
LEARN:  📚 課程目錄  │  📊 我的學習  │  ⚙ 課程管理
COACH:  🤖 AI 教練   │  📋 陪跑計畫  │  📈 能力評估
BOOST:  🏢 客戶管理  │  🔄 Pipeline  │  🎯 業績目標
```

### Mobile（< 768px）

Top Bar 收起為漢堡選單，展開為 Drawer 側邊導航。

## 7. 品牌設計規範

### 色彩系統

| 變數 | 色碼 | 用途 |
|------|------|------|
| `--xd-navy` | #0F2744 | 深海軍藍（主品牌色） |
| `--xd-navy-light` | #1B3A5C | 海軍藍亮色 |
| `--xd-accent` | #00B4D8 | 科技藍（強調） |
| `--xd-learn` | #3B82F6 | 驅・知 知識藍 |
| `--xd-learn-light` | #EFF6FF | 驅・知 淺背景 |
| `--xd-coach` | #10B981 | 驅・伴 成長綠 |
| `--xd-coach-light` | #ECFDF5 | 驅・伴 淺背景 |
| `--xd-boost` | #F59E0B | 驅・效 能量金 |
| `--xd-boost-light` | #FFFBEB | 驅・效 淺背景 |
| `--xd-danger` | #EF4444 | 警告/刪除 |
| `--xd-success` | #22C55E | 成功 |
| `--xd-bg` | #F8FAFC | 頁面背景 |
| `--xd-surface` | #FFFFFF | 卡片背景 |
| `--xd-text` | #1E293B | 主文字 |
| `--xd-muted` | #64748B | 次要文字 |
| `--xd-border` | #E2E8F0 | 邊線 |

### 字型

- 中文：Noto Sans TC (400/500/600/700)
- 英文：Inter (400/500/600/700)
- 等寬：JetBrains Mono（程式碼、數據）

### 間距

8px 基底系統：4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64

### 圓角

- sm: 6px（小元素、Badge）
- md: 10px（卡片、按鈕）
- lg: 16px（Modal、大卡片）
- xl: 24px（登入卡片）

## 8. Demo 模式規格

### 虛構公司

- **公司名**：芯達科技股份有限公司（SinDa Technology）
- **規模**：50 人，年營收 NT$12 億
- **業務**：IC 通路代理（車用電子、IoT）
- **痛點**：新人養成慢、Top Sales 經驗難複製、業績停滯

### Demo 角色

| 帳號 | 姓名 | 角色 | 視角 |
|------|------|------|------|
| `lin@sinda.com` | 林志明 | Manager | 全局 KPI、團隊績效、Pipeline |
| `chen@sinda.com` | 陳柏翰 | Sales | 我的學習、AI 教練、我的業績 |
| `chang@sinda.com` | 張淑芬 | Trainer | 我的學員、課程管理、陪跑計畫 |
| `admin@sinda.com` | 管理員 | Admin | 完整管理功能 |

- 登入頁提供快速角色切換按鈕
- 所有密碼：`demo`

## 9. 非功能需求

| 需求 | 規格 |
|------|------|
| 響應式 | Mobile-first，360px ~ 1920px |
| 效能 | 首頁載入 < 2s，頁面切換 < 200ms |
| 離線 | Demo 模式完全離線運行 |
| 瀏覽器 | Chrome/Edge/Safari 最新 2 版 |
| 可維護 | 單一檔案 < 200 行，模組清晰分離 |
| 可擴展 | Store 抽象層，可替換後端 |
| 無障礙 | 語意化 HTML、鍵盤操作、色彩對比 |
