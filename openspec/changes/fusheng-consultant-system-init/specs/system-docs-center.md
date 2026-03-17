# SPEC: SYSTEM — 文件中心（Documentation Center）

## 基本資訊
- **路由**：`/docs-center/*`
- **角色權限**：三角色皆可檢視
- **子頁面**：5 個

---

## 子頁面一覽

| 路由 | 頁面名稱 | 主要功能 |
|------|----------|----------|
| `/docs-center/architecture` | 開發架構文件 | 系統架構圖 + ERD + 技術棧 |
| `/docs-center/changelog` | 變更紀錄 | CHANGELOG.md 渲染 + 搜尋 |
| `/docs-center/test-records` | 測試紀錄 | 測試結果統計 + UAT 表單 |
| `/docs-center/logs` | 系統日誌查詢 | system_logs 篩選 + diff |
| `/docs-center/user-manual` | 使用手冊 | 三角色操作指南 + PDF 匯出 |

---

## /docs-center/architecture — 開發架構文件

### 功能需求
1. **系統架構圖**
   - 使用 Mermaid.js 渲染
   - 顯示三層架構：Client → API → Data + AI
   - 標示技術棧（Next.js、Supabase、Claude API、Vercel）
   - 可放大檢視

2. **資料庫 ERD**
   - 使用 Mermaid ER Diagram 語法
   - 顯示所有 15 張資料表的關聯
   - 標示 PK、FK、欄位型別
   - 可放大檢視

3. **技術棧說明表格**
   - 列出所有使用的技術 + 版本 + 用途
   - 按層級分類（框架/樣式/資料庫/AI/工具）

4. **環境變數清單**
   - 列出所有環境變數的 KEY 名稱
   - 敏感值遮蔽（顯示 `••••••`）
   - 標示來源（Supabase / Anthropic / 自訂）

### 驗收條件
- [ ] Mermaid 架構圖正確渲染
- [ ] ERD 圖包含所有 15 張資料表
- [ ] 技術棧表格完整
- [ ] 環境變數敏感值正確遮蔽

---

## /docs-center/changelog — 變更紀錄

### 功能需求
1. **CHANGELOG.md 讀取**
   - 從 `/docs/CHANGELOG.md` 讀取內容
   - 解析 Keep a Changelog 格式

2. **版本卡片式展示**
   - 每個版本一張卡片
   - 版本號 + 日期 作為卡片標題
   - 變更類型色塊：
     - Added（綠）
     - Changed（藍）
     - Fixed（橙）
     - Removed（紅）
   - 每個類型下列出具體變更項目

3. **搜尋功能**
   - 頂部搜尋框
   - 關鍵字即時過濾（高亮匹配文字）
   - 顯示最後更新時間

### 驗收條件
- [ ] 正確讀取並解析 CHANGELOG.md
- [ ] 版本卡片正確展示
- [ ] 四種類型色塊區分正確
- [ ] 搜尋功能正常

---

## /docs-center/test-records — 測試紀錄

### 功能需求
1. **自動測試結果統計**
   - Pass/Fail 統計圓餅圖（Recharts PieChart）
   - 測試覆蓋率百分比（大字體）
   - 最後測試執行時間
   - 資料來源：讀取 Jest/Playwright 測試結果 JSON

2. **手動 UAT 紀錄表單**
   - 表格顯示所有 UAT 紀錄
   - 新增表單欄位：
     - 測試項目（必填）
     - 測試人（必填）
     - 結果：Pass / Fail / Pending（下拉）
     - 備註（選填）
     - 測試日期（日期選擇器）
   - 資料表：`uat_records`
   - 僅顧問可新增/編輯

### 驗收條件
- [ ] 測試結果圓餅圖正確顯示
- [ ] 覆蓋率百分比正確
- [ ] UAT 紀錄可新增/編輯
- [ ] 僅顧問可操作 UAT 表單

---

## /docs-center/logs — 系統日誌查詢

### 功能需求
1. **查詢介面**
   - 篩選器（頂部）：
     - 日期範圍（DatePicker，起迄日）
     - 模組（下拉：milestones / weekly_reports / issues / documents / kpi / auth / ai）
     - 動作類型（下拉：CREATE / UPDATE / DELETE / LOGIN / EXPORT / AI_GENERATE）
     - 使用者角色（下拉：consultant / manager / reviewer）
   - 篩選後顯示結果列表
   - 分頁（每頁 20 筆）

2. **日誌列表**
   - 欄位：時間、使用者、角色、動作、模組、摘要
   - 點擊展開顯示詳細資訊

3. **Diff 對比**
   - UPDATE 操作展開後顯示 old_value vs new_value 對比
   - 使用左右對比或行內 diff 標記（新增/刪除/修改）
   - 變更欄位高亮

4. **CSV 匯出**
   - 匯出當前篩選結果為 CSV
   - 使用 PapaParse 生成
   - 檔名格式：`system-logs-{date}.csv`
   - 匯出操作記錄到 system_logs

### 驗收條件
- [ ] 四個篩選器正確過濾日誌
- [ ] 分頁正常
- [ ] UPDATE 操作可展開查看 diff
- [ ] old_value vs new_value 差異正確標示
- [ ] CSV 匯出功能正常

---

## /docs-center/user-manual — 使用手冊

### 功能需求
1. **三章內容**
   - 第一章：顧問操作指南
     - 登入系統
     - 管理里程碑
     - 撰寫/AI 生成週報
     - 管理 Issue
     - 上傳文件
     - 設定/追蹤 KPI
     - 使用 AI 功能
   - 第二章：主管檢視指南
     - 檢視專案總覽
     - 瀏覽週報與留言
     - 查看 Issue 狀態
     - 下載文件
     - 匯出報告
   - 第三章：審核者簽核指南
     - 檢視專案進度
     - 審核週報
     - 提交審核意見
     - 電子簽核流程

2. **左側章節目錄**
   - 固定定位（sticky）
   - Scroll spy：滾動時自動高亮當前章節
   - 點擊章節平滑滾動定位

3. **搜尋與高亮**
   - 頂部搜尋框
   - 輸入關鍵字即時高亮匹配文字
   - 顯示匹配數量
   - 可上下切換匹配位置

4. **PDF 匯出**
   - 一鍵匯出完整使用手冊為 PDF
   - 使用 html2pdf.js
   - 含目錄頁
   - 匯出操作記錄到 system_logs

### 驗收條件
- [ ] 三章內容完整且正確
- [ ] 左側目錄 scroll spy 正常
- [ ] 搜尋高亮功能正常
- [ ] PDF 匯出含目錄且格式正確
