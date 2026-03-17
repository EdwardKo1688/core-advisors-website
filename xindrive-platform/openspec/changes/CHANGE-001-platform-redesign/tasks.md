# CHANGE-001: 實作任務拆解

## 執行順序與依賴關係

```
Phase 0: 基礎建設
  T01 → T02 → T03 → T04（序列依賴）

Phase 1: 核心框架
  T05 + T06 + T07（可平行）→ T08

Phase 2: 頁面開發
  T09 → T10（Login → Dashboard）
  T11 → T12 → T13 → T14（LEARN 序列）
  T15 → T16 → T17 → T18（COACH 序列）
  T19 → T20 → T21 → T22（BOOST 序列）
  （三支柱可平行開發）

Phase 3: 整合與打磨
  T23 → T24 → T25 → T26
```

---

## Phase 0: 基礎建設

### T01: 建立新目錄結構

**狀態**：done
**依賴**：無

建立完整的 `src/` 目錄結構：
```
src/
├── index.html
├── css/
│   ├── design-system.css
│   ├── layout.css
│   └── pages/ (login.css, dashboard.css, learn.css, coach.css, boost.css)
├── js/
│   ├── app.js
│   ├── router.js
│   ├── store.js
│   ├── components/ (ui.js, charts.js, modal.js, table.js, kanban.js)
│   ├── pages/ (login.js, dashboard.js, learn/, coach/, boost/)
│   └── data/ (demo-story.js)
└── assets/ (logo.svg, icons/)
```

保留舊的 `index.html` 為 `index.html.bak` 直到新版本穩定。

**驗收標準**：
- [x] 所有目錄已建立
- [x] index.html 可載入（空白頁面但無錯誤）

---

### T02: CSS Design System

**狀態**：done
**依賴**：T01

建立 `css/design-system.css`：
- CSS Variables（色彩、字型、間距、圓角、陰影）
- CSS Reset
- 字型層級（Display/H1/H2/H3/Body/Small/Caption）
- Button 系統（primary/accent/learn/coach/boost/outline/ghost/danger × sm/md/lg）
- Card 系統（standard/elevated/pillar/stat）
- Badge 系統（各種顏色 + 尺寸）
- Form 元素樣式（input/select/textarea/checkbox）
- 表格基礎樣式
- 工具類別（text-align, flex, margin, padding）

**驗收標準**：
- [x] 所有 CSS 變數可用
- [x] Button 各狀態正確
- [x] Card 各變體正確
- [x] 響應式基礎就緒

---

### T03: Layout CSS

**狀態**：done
**依賴**：T02

建立 `css/layout.css`：
- Top Bar 佈局（Logo + 主導航 + 用戶區）
- Sub Navigation 佈局
- Content Area（最大寬度 + padding）
- Mobile Drawer 導航
- 響應式斷點（768px / 1024px）

**驗收標準**：
- [x] Top Bar 正確顯示
- [x] Content 區域置中、有呼吸感
- [x] Mobile 下漢堡選單可切換

---

### T04: 頁面專屬 CSS

**狀態**：done
**依賴**：T02

建立各頁面 CSS（可先建立空檔案，開發各頁面時再填入）：
- `css/pages/login.css` — 登入頁深色背景、卡片
- `css/pages/dashboard.css` — KPI 卡片網格、圖表區
- `css/pages/learn.css` — 課程卡片、學習介面雙欄
- `css/pages/coach.css` — 對話介面、雷達圖
- `css/pages/boost.css` — Kanban 看板、表格

**驗收標準**：
- [x] 各 CSS 檔案可被正確載入

---

## Phase 1: 核心框架

### T05: Router

**狀態**：done
**依賴**：T01

建立 `js/router.js`：
- Hash-based routing（`window.onhashchange`）
- Dynamic import 按需載入頁面模組
- 路由表（14 個路由）
- Route params 解析（`:id`）
- 導航 Guard（未登入 → redirect 到 login）
- `Router.navigate(path)` API
- `Router.current()` 取得當前路由

**驗收標準**：
- [x] Hash 變化觸發正確頁面載入
- [x] 未登入自動跳轉登入頁
- [x] Route params 可正確取得

---

### T06: Store

**狀態**：done
**依賴**：T01

建立 `js/store.js`：
- `Store.get(collection)` — 取得整個集合
- `Store.set(collection, data)` — 設定整個集合
- `Store.find(collection, id)` — 依 ID 查找
- `Store.query(collection, filter)` — 依條件篩選
- `Store.add(collection, item)` — 新增（自動產 UUID）
- `Store.update(collection, id, patch)` — 更新
- `Store.remove(collection, id)` — 刪除
- `Store.state` — 全局狀態（currentUser, currentPillar）
- 事件系統：`Store.on(event, cb)` / `Store.emit(event, data)`
- localStorage 序列化/反序列化

**驗收標準**：
- [x] CRUD 操作正確
- [x] 資料持久化到 localStorage
- [x] 事件系統可用
- [x] UUID 自動產生

---

### T07: UI 元件庫

**狀態**：done
**依賴**：T01

建立 `js/components/ui.js`：
- `h(tag, attrs, children)` — DOM 建構 helper
- `icon(name)` — SVG icon 元件（內建常用 icon set）
- `btn(text, opts)` — Button 元件
- `badge(text, variant)` — Badge 元件
- `card(content, opts)` — Card 容器
- `statCard(opts)` — KPI 統計卡片
- `avatar(name)` — 頭像（名字首字母）
- `progressBar(percent, color)` — 進度條
- `toast(message, type)` — Toast 通知
- `emptyState(message, icon)` — 空狀態提示

建立 `js/components/charts.js`：
- `lineChart(data, opts)` — SVG 折線圖
- `barChart(data, opts)` — SVG 長條圖
- `radarChart(data, opts)` — SVG 雷達圖
- `progressRing(percent, opts)` — SVG 進度環
- `miniBar(value, max)` — 迷你長條

建立 `js/components/modal.js`：
- `modal(content, opts)` — 居中 Modal
- `drawer(content, opts)` — 右側 Drawer
- `confirm(message)` — 確認對話框

建立 `js/components/table.js`：
- `dataTable(columns, data, opts)` — 可排序/篩選表格
- 欄位排序（點擊表頭）
- 搜尋過濾
- 分頁（可選）

建立 `js/components/kanban.js`：
- `kanban(columns, cards, opts)` — Kanban 看板
- 拖曳移動卡片（原生 Drag API）
- 欄位標題 + 統計

**驗收標準**：
- [x] h() 可正確建構 DOM
- [x] 所有基礎元件可渲染
- [x] 圖表可正確繪製
- [x] Modal/Drawer 可開關
- [x] Kanban 拖曳可用

---

### T08: Demo Story 資料

**狀態**：done
**依賴**：T06

建立 `js/data/demo-story.js`：
- 芯達科技組織資料
- 4 個主要用戶 + 6-8 個背景角色
- 4 門課程 + 模組 + 課堂（每門 3-6 個模組，每模組 2-4 堂）
- 選課記錄 + 學習進度
- 2 個陪跑計畫 + Sessions + 能力評估
- 7 家客戶 + 聯絡人
- 13 個商機（各階段分佈）
- 業績目標（Q1 2026）
- 通知記錄
- `seedDemoStory()` 函數 — 檢查 localStorage，無資料時自動填充

**驗收標準**：
- [x] seedDemoStory() 可正確執行
- [x] 所有集合都有合理資料
- [x] 角色間的資料關聯正確
- [x] 故事邏輯一致（陳柏翰的課程進度 = 他的商機表現成長曲線）

---

## Phase 2: 頁面開發

### T09: Login Page

**狀態**：done
**依賴**：T02, T05, T06

- 深色漸層背景
- 品牌 Logo + 標語
- Email/Password 表單
- Demo 快速角色切換（3 個角色卡片按鈕）
- 登入驗證（Demo 模式：匹配 email → 登入）
- 登入成功 → Store 設定 currentUser → navigate 到 dashboard
- RWD 響應式

**驗收標準**：
- [x] 視覺品牌感到位
- [x] Demo 角色一鍵登入
- [x] 登入後正確跳轉
- [x] Mobile 佈局正確

---

### T10: Dashboard Page

**狀態**：done
**依賴**：T07, T08, T09

- 讀取 currentUser 角色
- 根據角色渲染不同佈局：
  - Manager：全局 KPI + 趨勢圖 + Pipeline + 雷達圖 + 動態
  - Sales：我的學習 + 我的陪跑 + 我的業績 + 我的待辦
  - Trainer：學員總覽 + 我的陪跑 + 課程數據 + 成長曲線
- KPI Stat Cards（4 張）
- SVG 圖表（折線/長條/雷達）
- 最近動態時間軸

**驗收標準**：
- [x] 3 種角色 Dashboard 差異明顯
- [x] KPI 數字正確（來自 Store）
- [x] 圖表可正確渲染
- [x] 動態時間軸有資料

---

### T11: LEARN — 課程目錄

**狀態**：done
**依賴**：T07, T08

- 課程卡片網格（3/2/1 欄 RWD）
- 篩選列（分類 + 難度 + 排序）
- 搜尋即時過濾
- 課程卡片完整呈現（封面/標題/Badge/進度/CTA）
- 點擊 → navigate 到課程詳情

**驗收標準**：
- [x] 4 門課程正確顯示
- [x] 篩選/搜尋可用
- [x] 進度條顯示已選課者的進度
- [x] RWD 正確

---

### T12: LEARN — 課程詳情/學習

**狀態**：done
**依賴**：T11

- 左側：模組目錄（手風琴）
- 右側：課堂內容區
- 頂部：課程標題 + 進度條
- 底部：上一堂/下一堂
- 課堂內容支援：文字說明、測驗（選擇題）
- 完成課堂 → 更新 Store 進度

**驗收標準**：
- [x] 手風琴展開收合
- [x] 課堂切換順暢
- [x] 進度自動更新
- [x] Mobile 改為 Tab 切換（目錄/內容）

---

### T13: LEARN — 學習進度

**狀態**：done
**依賴**：T11

- 已選課程列表 + 進度條
- 總學習時數
- 技能雷達圖

**驗收標準**：
- [x] 進度數據正確
- [x] 雷達圖渲染正確

---

### T14: LEARN — 課程管理

**狀態**：done
**依賴**：T11

- 課程表格（CRUD）
- 新增/編輯 Modal
- 發佈/下架 Toggle
- 權限控制（Admin/Manager/Trainer 可見）

**驗收標準**：
- [x] CRUD 操作正確
- [x] Sales 角色看不到此頁

---

### T15: COACH — 陪跑中心

**狀態**：done
**依賴**：T07, T08

- 計畫卡片列表
- 卡片顯示：教練/學員、方法論、進度、下一 Session
- Manager 看全部，Sales 看自己的

**驗收標準**：
- [x] 卡片資料正確
- [x] 角色權限過濾正確

---

### T16: COACH — AI 教練對話

**狀態**：done
**依賴**：T15

- ChatGPT 風格對話介面（品牌化）
- 頂部資訊列（方法論/場景/Session）
- 預載 Demo 對話（2-3 輪 MEDDIC 練習）
- 輸入框（Demo：送出後顯示預設回覆）
- 場景選擇 Tabs

**驗收標準**：
- [x] 對話介面視覺到位
- [x] Demo 對話順暢
- [x] Mobile 全寬顯示

---

### T17: COACH — Session 管理

**狀態**：done
**依賴**：T15

- Session 列表（時間倒序）
- Session 詳情（筆記/行動項目/回饋）
- 行動項目可勾選

**驗收標準**：
- [x] Session 資料正確
- [x] 行動項目互動可用

---

### T18: COACH — 能力評估

**狀態**：done
**依賴**：T15

- 8 維度雷達圖（三層疊加）
- 各維度分數列表
- 評估歷史
- 建議學習路徑

**驗收標準**：
- [x] 三層雷達圖渲染正確
- [x] 分數數據一致

---

### T19: BOOST — 業績總覽

**狀態**：done
**依賴**：T07, T08

- KPI 卡片（營收/轉換率/新客戶/成交週期）
- 營收趨勢折線圖
- 業績排行榜
- 個人/團隊切換

**驗收標準**：
- [x] KPI 數字正確
- [x] 圖表渲染正確
- [x] 切換邏輯正確

---

### T20: BOOST — 客戶管理

**狀態**：done
**依賴**：T19

- 客戶表格（DataTable）
- 篩選：分級/狀態/負責人
- 搜尋
- 點擊展開 Drawer 詳情
- 新增/編輯客戶 Modal

**驗收標準**：
- [x] 7 家客戶正確顯示
- [x] 篩選/搜尋可用
- [x] Drawer 詳情完整

---

### T21: BOOST — Pipeline Kanban

**狀態**：done
**依賴**：T19

- 5 欄 Kanban 看板
- 各欄統計（商機數 + 加權金額）
- 商機卡片（名稱/客戶/金額/機率/負責人）
- 拖曳移動（更新 stage）
- 點擊商機 → Drawer 詳情（MEDDIC 評分/活動記錄）
- Lost 區域

**驗收標準**：
- [x] 13 個商機正確分佈
- [x] 拖曳可用
- [x] Drawer 詳情完整
- [x] 金額統計正確

---

### T22: BOOST — 業績目標

**狀態**：done
**依賴**：T19

- 目標 vs 實績長條圖
- 達成率進度環
- 個人/團隊/期間切換
- 目標設定 Modal（Admin/Manager）

**驗收標準**：
- [x] 圖表渲染正確
- [x] 切換邏輯正確
- [x] 目標 CRUD 可用

---

## Phase 3: 整合與打磨

### T23: 通知系統

**狀態**：done
**依賴**：T10

- Top Bar 鈴鐺 + Badge
- 下拉通知列表
- 標記已讀
- Toast 系統整合

**驗收標準**：
- [x] 通知列表正確
- [x] 未讀計數正確

---

### T24: RWD 全面測試與修正

**狀態**：done
**依賴**：T09-T22

- 所有頁面在 360px / 768px / 1024px / 1440px 下正確
- Mobile Drawer 導航完整
- 表格/Kanban 在 Mobile 下可水平捲動
- 登入頁 Mobile 體驗

**驗收標準**：
- [x] 所有斷點佈局正確
- [x] 無水平溢出
- [x] 觸控操作友善

---

### T25: Demo 流程端到端驗證

**狀態**：done
**依賴**：T24

完整 5 分鐘 Demo 流程測試：
1. 登入（選角色）
2. Dashboard（看到對應視角）
3. 驅・知（瀏覽課程、進入學習）
4. 驅・伴（AI 教練對話、能力評估）
5. 驅・效（Pipeline Kanban、業績目標）
6. 切換角色再走一遍

**驗收標準**：
- [x] 流程順暢無卡頓
- [x] 資料故事邏輯一致
- [x] 無 JS 錯誤
- [x] 視覺品質一致

---

### T26: CLAUDE.md 更新

**狀態**：done
**依賴**：T25

更新 `CLAUDE.md` 反映新架構：
- 新檔案結構
- 新的開發指引
- 新的 Preview Server 配置

**驗收標準**：
- [x] CLAUDE.md 與實際架構一致

---

## 任務統計

| Phase | 任務數 | 說明 |
|-------|--------|------|
| Phase 0 | T01-T04 (4) | 基礎建設 |
| Phase 1 | T05-T08 (4) | 核心框架 |
| Phase 2 | T09-T22 (14) | 頁面開發 |
| Phase 3 | T23-T26 (4) | 整合打磨 |
| **合計** | **26 個任務** | |
