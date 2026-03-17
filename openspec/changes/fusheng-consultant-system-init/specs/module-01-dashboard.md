# SPEC: MODULE-01 專案總覽儀表板

## 基本資訊
- **路由**：`/dashboard`
- **角色權限**：三角色皆可檢視，僅顧問可編輯摘要
- **資料來源**：`project_settings`、`milestones`、`issues`、`weekly_reports`

---

## 功能需求

### 1. 專案基本資訊卡片
- 顯示欄位：專案名稱、客戶名稱、開始日、結束日
- 整體進度百分比（大字體 + 進度條）
- 進度計算方式：已完成里程碑數 / 總里程碑數 × 100%
- 資料來源：`project_settings` + `milestones` 統計

### 2. 模組完成狀態圓餅圖
- 使用 Recharts PieChart
- 資料：各模組的完成狀態統計
- 顏色：完成（綠 #10b981）、進行中（藍 #3b82f6）、未開始（灰 #94a3b8）
- 滑鼠 hover 顯示具體數字

### 3. 里程碑逾期警示
- 從 `milestones` 資料表即時查詢
- 紅色警示：已逾期（planned_date < 今天 且 status ≠ completed）
- 黃色警示：即將到期（planned_date - 今天 ≤ 7 天 且 status ≠ completed）
- 每個警示顯示：里程碑名稱、負責人、逾期天數
- 無逾期時顯示「所有里程碑正常進行中」

### 4. 本週重點摘要卡片
- 顯示 `project_settings.weekly_summary` 內容
- 顧問可直接點擊編輯（inline editing）
- **AI 生成按鈕**：點擊後呼叫 `POST /api/ai/weekly-summary`，以本週所有模組活動為輸入，生成摘要草稿
- AI 生成的內容以紫色邊框標示，顧問確認後才儲存
- 支援 Markdown 格式

### 5. 最新三則 Issue 快速預覽
- 從 `issues` 資料表取最新三筆（依 created_at 降序）
- 每則顯示：標題、優先級徽章（高/中/低）、狀態標籤
- 點擊可跳轉至 `/issues` 頁面

---

## UI 規格
- 整體採用 Grid 佈局：上方資訊卡片，下方左右兩欄
- 左欄：圓餅圖 + 里程碑警示
- 右欄：週報摘要 + Issue 預覽
- 響應式：手機版改為單欄堆疊
- 所有卡片使用 shadcn/ui Card 元件
- Loading 狀態使用 Skeleton 動畫

---

## 驗收條件
- [ ] 專案名稱、客戶、日期、進度百分比正確顯示
- [ ] 圓餅圖正確呈現模組完成狀態
- [ ] 里程碑逾期警示正確標色（紅/黃）
- [ ] 本週摘要可手動編輯並儲存
- [ ] AI 生成摘要按鈕可正常觸發並回填
- [ ] 最新三則 Issue 正確顯示
- [ ] 手機版佈局正確切換為單欄
