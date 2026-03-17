# SPEC: MODULE-04 問題與待辦追蹤（Issue Tracker）

## 基本資訊
- **路由**：`/issues`
- **角色權限**：三角色皆可檢視留言，僅顧問可 CRUD 及拖曳
- **資料表**：`issues`、`issue_comments`

---

## 資料表 Schema

```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('high', 'medium', 'low')),
  assignee TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'done')),
  column_order INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES user_profiles(id),
  author_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 功能需求

### 1. Kanban 看板
- 三欄佈局：
  - 待處理（todo）— 灰色標題
  - 處理中（in_progress）— 藍色標題
  - 已解決（done）— 綠色標題
- 每欄顯示該狀態的卡片數量
- 卡片依 `column_order` 排序

### 2. Issue 卡片
- 卡片欄位顯示：
  - 標題（粗體）
  - 優先級徽章：高（紅）/ 中（黃）/ 低（綠）
  - 負責人
  - 截止日（逾期顯示紅色）
  - 留言數量小徽章
- 點擊卡片開啟詳情側邊面板

### 3. 拖曳跨欄
- 使用 `@dnd-kit/core` 實作
- 僅顧問角色可拖曳
- 拖曳時卡片半透明
- 放置後自動更新 `status` 和 `column_order`
- 拖曳操作觸發 `logAction()` 記錄

### 4. Issue CRUD
- **新增**：「+ 新增問題」按鈕，開啟 Dialog
  - 欄位：標題（必填）、描述、優先級（下拉）、負責人、截止日
- **編輯**：詳情面板中可修改所有欄位
- **刪除**：確認 Dialog 後刪除
- 僅顧問可操作

### 5. 留言紀錄
- 詳情側邊面板下方顯示留言
- 三角色皆可留言
- 每則顯示：內容、留言者、角色標籤、時間戳
- 按時間排序（最舊在上）

### 6. 篩選器
- 頂部篩選列：
  - 優先級：全部 / 高 / 中 / 低
  - 負責人：全部 / [動態列表]
  - 狀態：全部 / 待處理 / 處理中 / 已解決
- 篩選即時生效（client-side 過濾）
- 顯示篩選結果數量

### 7. AI 分析面板
- 頂部「AI 分析」按鈕（紫色，✨ 圖示）
- 點擊後呼叫 `POST /api/ai/issue-analysis`
- API 收集所有 Issue 數據（標題、描述、優先級、狀態、建立時間、留言）
- Claude API 分析後回傳：
  - 建議優先處理順序（考量截止日、優先級、依賴關係）
  - 可能根因分析（基於描述和留言內容）
  - 改善方向建議
- 結果顯示為右側滑出面板
- 面板標記「AI 分析」標籤
- 僅顧問可觸發

---

## 驗收條件
- [ ] Kanban 三欄正確顯示對應狀態的卡片
- [ ] 卡片優先級徽章正確標色
- [ ] 顧問可拖曳卡片跨欄，狀態自動更新
- [ ] 非顧問角色無法拖曳
- [ ] 可新增、編輯、刪除 Issue
- [ ] 留言功能正常（三角色皆可留言）
- [ ] 篩選器正確過濾卡片
- [ ] AI 分析按鈕可觸發並顯示建議報告
