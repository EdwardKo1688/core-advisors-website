# SPEC: MODULE-05 交付文件管理

## 基本資訊
- **路由**：`/documents`
- **角色權限**：三角色皆可檢視/下載，僅顧問可上傳/刪除
- **資料表**：`documents`、`document_versions`
- **儲存**：Supabase Storage

---

## 資料表 Schema

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN ('diagnosis', 'improvement', 'training', 'presentation', 'final')),
  version INT NOT NULL DEFAULT 1,
  file_size BIGINT NOT NULL,
  file_path TEXT NOT NULL,
  content_summary TEXT,  -- AI 搜尋用，上傳時提取前 2000 字
  uploaded_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version INT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 功能需求

### 1. 文件上傳
- 拖曳上傳區域（虛線框，拖入時高亮）
- 也可點擊選擇檔案
- 支援格式：PDF (.pdf)、Word (.docx)、Excel (.xlsx)、PowerPoint (.pptx)
- 大小限制：最大 50MB
- 上傳時需選擇分類標籤
- 上傳後自動提取文字摘要（前 2000 字）存入 `content_summary`
  - PDF：使用 pdf-parse 後端提取
  - 其他格式：僅儲存檔名作為摘要
- 儲存路徑：`documents/{category}/{filename}_v{version}`
- 上傳操作記錄到 system_logs

### 2. 文件列表
- 表格顯示：文件名稱、分類標籤、版本號、大小、上傳者、上傳時間
- 分類標籤篩選：
  - 全部
  - 診斷報告（diagnosis）
  - 改善方案（improvement）
  - 培訓教材（training）
  - 簡報（presentation）
  - 最終報告（final）
- 分類標籤以色塊徽章顯示
- 支援依欄位排序

### 3. 版本管理
- 同名文件再次上傳時：
  - 自動遞增版本號（v1 → v2 → v3...）
  - 舊版本移至 `document_versions` 資料表
  - `documents` 表的版本號更新為最新
- 版本歷史列表：展開顯示所有歷史版本
- 可下載任何歷史版本

### 4. 檔案操作
- **預覽**：PDF 直接在頁面中顯示（iframe 或 embed）
- **下載**：所有格式皆可下載
- **刪除**：僅管理員（顧問）可刪除，刪除前確認 Dialog
- 刪除時同步刪除 Supabase Storage 中的檔案
- 所有操作記錄到 system_logs

### 5. AI 智慧搜尋
- 頂部搜尋框，支援自然語言輸入
- 輸入後呼叫 `POST /api/ai/document-search`
- API 將搜尋查詢 + 所有文件的 `content_summary` 送至 Claude API
- Claude API 回傳相關文件排序（含相關性說明）
- 搜尋結果高亮顯示匹配文件
- 無關鍵字時使用一般文字搜尋（模糊匹配檔名）

---

## 驗收條件
- [ ] 可拖曳上傳 PDF/Word/Excel/PowerPoint 檔案
- [ ] 檔案大小限制 50MB 正確生效
- [ ] 副檔名白名單正確（拒絕非允許格式）
- [ ] 分類標籤正確顯示且可篩選
- [ ] 同名文件上傳自動遞增版本號
- [ ] 歷史版本可瀏覽和下載
- [ ] PDF 可在頁面中直接預覽
- [ ] 所有格式可下載
- [ ] 僅顧問可刪除文件
- [ ] AI 搜尋可正常回傳相關文件排序
