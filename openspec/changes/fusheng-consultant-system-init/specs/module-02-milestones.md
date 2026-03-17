# SPEC: MODULE-02 時程里程碑管理

## 基本資訊
- **路由**：`/milestones`
- **角色權限**：三角色皆可檢視，僅顧問可 CRUD
- **資料表**：`milestones`

---

## 資料表 Schema

```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  assignee TEXT NOT NULL,
  planned_date DATE NOT NULL,
  actual_date DATE,
  status TEXT NOT NULL DEFAULT 'on_track'
    CHECK (status IN ('on_track', 'delayed', 'completed')),
  "order" INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 功能需求

### 1. 甘特圖視圖
- 使用 CSS Grid 自製實作（非第三方套件）
- 橫軸：月份單位（顯示專案期間的所有月份）
- 縱軸：里程碑名稱（依 order 排序）
- 每個里程碑顯示為水平色條：
  - 綠色：on_track（準時進行中）
  - 紅色：delayed（已延遲）
  - 灰色：completed（已完成）
- 今日線（垂直虛線標示當前日期位置）
- 滑鼠 hover 顯示詳細資訊（名稱、負責人、日期）

### 2. 里程碑 CRUD
- **新增**：Dialog 表單，欄位：名稱、負責人、預定日期
- **編輯**：點擊里程碑開啟編輯 Dialog
- **刪除**：確認 Dialog 後刪除
- 所有操作觸發 `logAction()` 記錄
- 僅顧問角色可操作，主管/審核者隱藏操作按鈕

### 3. 狀態自動判斷
- 若 `actual_date` 已填入 → 狀態自動設為 `completed`
- 若 `planned_date < 今天` 且未完成 → 狀態自動設為 `delayed`
- 其餘 → `on_track`
- 狀態變更時自動更新 `updated_at`

### 4. 整體進度百分比
- 計算方式：completed 數量 / 總數量 × 100%
- 顯示於頁面頂部（大字體 + 進度條）
- 即時更新（每次 CRUD 後重新計算）

### 5. 列表/表格視圖
- 可切換：甘特圖 ↔ 表格
- 表格欄位：名稱、負責人、預定日、實際完成日、狀態、操作
- 支援依欄位排序

---

## 驗收條件
- [ ] 甘特圖以月份為單位正確顯示所有里程碑
- [ ] 三種狀態正確標色（綠/紅/灰）
- [ ] 今日線正確標示
- [ ] 可新增、編輯、刪除里程碑
- [ ] 狀態自動判斷邏輯正確
- [ ] 整體進度百分比自動計算
- [ ] 可切換甘特圖/表格視圖
- [ ] 非顧問角色無法操作 CRUD
