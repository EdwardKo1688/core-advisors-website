# SPEC: MODULE-06 KPI 成效儀表板

## 基本資訊
- **路由**：`/kpi`
- **角色權限**：三角色皆可檢視，僅顧問可管理指標和輸入數值
- **資料表**：`kpi_definitions`、`kpi_records`

---

## 資料表 Schema

```sql
CREATE TABLE kpi_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  target_value DECIMAL NOT NULL,
  baseline_value DECIMAL NOT NULL DEFAULT 0,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE kpi_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL,
  actual_value DECIMAL NOT NULL,
  achievement_rate DECIMAL GENERATED ALWAYS AS (
    CASE WHEN target_value > 0
      THEN (actual_value / target_value * 100)
      ELSE 0
    END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(kpi_id, month, year)
);
```

注意：`achievement_rate` 為 computed column，需改用 application-level 計算（Supabase 限制）。

---

## 功能需求

### 1. KPI 指標管理
- 顧問可自訂 KPI 指標
- 新增 Dialog 欄位：
  - 名稱（必填）
  - 單位（如：%、次、件、分）
  - 目標值（必填，數值）
  - 起始基準值（預設 0）
  - 描述（選填）
- 可編輯、刪除既有指標
- 支援拖曳排序（display_order）
- 支援至少 6 個並行 KPI 指標

### 2. 每月數值輸入
- 每個 KPI 指標下方顯示月份輸入網格
- 欄位：1月 ~ 12月（或專案期間的月份）
- 點擊月份格子可輸入/修改實際數值
- 儲存時自動計算達成率（actual_value / target_value × 100%）
- 同月份不可重複輸入（UNIQUE 約束）

### 3. 折線圖
- 使用 Recharts LineChart
- 每個 KPI 顯示獨立圖表（或可切換查看）
- 兩條線：
  - 目標線：虛線（dashed），橫跨所有月份，固定值
  - 實際線：實線（solid），依月份數據繪製
- X 軸：月份
- Y 軸：數值（含單位）
- 達成率以數字標示在數據點旁
- 顏色：目標線灰色、實際線藍色，未達標區段標紅

### 4. AI 趨勢預測
- KPI 頁面頂部「AI 預測趨勢」按鈕（紫色，✨ 圖示）
- 點擊後呼叫 `POST /api/ai/kpi-forecast`
- API 收集所有 KPI 的歷史數據（指標定義 + 月份記錄）
- Claude API 分析後回傳：
  - 未來 1~2 個月的預測值
  - 趨勢判斷（上升/持平/下降）
  - 風險評估（哪些指標可能無法達標）
  - 改善建議
- 預測值以虛線延伸顯示在折線圖上（紫色虛線）
- 風險指標以紅色警示標記
- 結果面板標記「AI 預測」標籤
- 僅顧問可觸發

### 5. KPI 總覽
- 頂部顯示所有 KPI 的摘要卡片
- 每張卡片：指標名稱、最新達成率、趨勢箭頭（↑↓→）
- 達成率 ≥ 100%：綠色
- 達成率 70%~99%：黃色
- 達成率 < 70%：紅色

---

## 驗收條件
- [ ] 可新增、編輯、刪除 KPI 指標
- [ ] 支援至少 6 個並行指標
- [ ] 每月數值可輸入並儲存
- [ ] 達成率自動計算（actual/target × 100%）
- [ ] 折線圖正確顯示目標虛線 vs 實際實線
- [ ] AI 預測按鈕可觸發並回傳預測結果
- [ ] 預測值以紫色虛線延伸在圖表上
- [ ] KPI 摘要卡片正確標色
- [ ] 非顧問角色無法新增/編輯/刪除
