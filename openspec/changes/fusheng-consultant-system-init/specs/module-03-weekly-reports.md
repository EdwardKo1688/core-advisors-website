# SPEC: MODULE-03 每週進度週報

## 基本資訊
- **路由**：`/weekly-reports`（列表）、`/weekly-reports/[id]`（詳情）
- **角色權限**：三角色皆可檢視留言，僅顧問可建立/編輯週報
- **資料表**：`weekly_reports`、`report_comments`

---

## 資料表 Schema

```sql
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INT NOT NULL,
  year INT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  accomplishments TEXT,
  next_plans TEXT,
  difficulties TEXT,
  help_needed TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(week_number, year)
);

CREATE TABLE report_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES weekly_reports(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES user_profiles(id),
  author_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 功能需求

### 1. 週報表單
- 四個文字區域欄位：
  - 本週完成事項（accomplishments）
  - 下週計畫（next_plans）
  - 遭遇困難（difficulties）
  - 需協助事項（help_needed）
- 支援 Markdown 格式輸入
- 儲存時觸發 `logAction()` 記錄

### 2. 自動週次標記
- 根據 `project_settings.start_date` 自動計算當前週次
- 週次範圍：Week 01 ~ Week 12
- 自動填入 `period_start`（週一）和 `period_end`（週日）
- 已存在的週次不可重複建立

### 3. AI 自動草稿
- 週報表單上方顯示「AI 生成草稿」按鈕（紫色，✨ 圖示）
- 點擊後呼叫 `POST /api/ai/weekly-summary`
- API 收集本週資料：
  - 里程碑狀態變動
  - Issue 新增/關閉/狀態變更
  - 文件上傳記錄
  - KPI 數值更新
- Claude API 分析後回傳四欄位草稿
- 草稿自動填入表單（可編輯），標記 `is_ai_generated = true`
- 顧問編輯後儲存，AI 標記保留

### 4. 歷史週報時間軸
- 列表頁顯示所有歷史週報
- 時間軸樣式（最新在上）
- 每筆顯示：週次、日期範圍、前 100 字預覽
- 點擊進入詳情頁

### 5. PDF 匯出
- 單篇週報一鍵匯出 PDF（html2pdf.js）
- PDF 封面：
  - 專案名稱（project_settings.project_name）
  - 週次（Week XX）
  - 日期範圍
  - 顧問名稱
- 內容頁：四欄位完整內容
- 匯出操作記錄到 system_logs

### 6. 留言功能
- 週報詳情頁下方顯示留言區
- 主管與審核者可留言
- 每則留言顯示：內容、留言者名稱、角色標籤、時間戳
- 留言按時間排序（最舊在上）

---

## 驗收條件
- [ ] 週報表單四欄位可輸入並儲存
- [ ] 週次自動標記（Week 01 ~ Week 12）
- [ ] AI 生成草稿按鈕可觸發並回填四欄位
- [ ] AI 生成內容標記為「AI 生成」
- [ ] 歷史週報時間軸正確顯示
- [ ] PDF 匯出含封面且格式正確
- [ ] 主管/審核者可在週報下方留言
- [ ] 同一週次不可重複建立
