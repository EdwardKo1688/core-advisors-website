# SPEC: SYSTEM — AI 輔助服務

## 基本資訊
- **技術**：Claude API（@anthropic-ai/sdk）
- **模型**：Claude Haiku（低成本、速度快）
- **呼叫方式**：Next.js API Routes（server-side only）
- **存取限制**：僅顧問角色可觸發
- **資料表**：`ai_usage_logs`

---

## 資料表 Schema

```sql
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  feature TEXT NOT NULL
    CHECK (feature IN ('weekly_summary', 'issue_analysis', 'kpi_forecast', 'document_search')),
  input_tokens INT,
  output_tokens INT,
  model TEXT NOT NULL DEFAULT 'claude-haiku-4-5-20251001',
  cost_usd DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## AI-01：週報自動摘要

### API Route
`POST /api/ai/weekly-summary`

### 流程
1. 驗證用戶為顧問角色
2. 檢查 rate limit（每分鐘 5 次）
3. 收集本週資料：
   - `milestones`：本週狀態變動的里程碑
   - `issues`：本週新增、關閉、狀態變更的 Issue
   - `documents`：本週上傳的文件
   - `kpi_records`：本週更新的 KPI 數值
4. 組裝 prompt（使用 `lib/ai/prompts.ts` 模板）
5. 呼叫 Claude API
6. 回傳四欄位草稿（accomplishments, next_plans, difficulties, help_needed）
7. 記錄 AI 使用日誌

### Prompt 模板
```
你是一位企業顧問助手，請根據以下本週專案活動資料，生成一份週報草稿。

[本週活動資料]

請以繁體中文回覆，分為四個部分：
1. 本週完成事項
2. 下週計畫
3. 遭遇困難
4. 需協助事項

每個部分用條列式，簡潔專業。
```

### 回應格式
```json
{
  "accomplishments": "- ...\n- ...",
  "next_plans": "- ...\n- ...",
  "difficulties": "- ...\n- ...",
  "help_needed": "- ...\n- ..."
}
```

---

## AI-02：問題分析建議

### API Route
`POST /api/ai/issue-analysis`

### 流程
1. 驗證用戶為顧問角色
2. 檢查 rate limit
3. 收集所有 Issue 資料：標題、描述、優先級、狀態、截止日、留言、建立時間
4. 呼叫 Claude API 分析
5. 回傳分析報告
6. 記錄 AI 使用日誌

### Prompt 模板
```
你是一位企業顧問專案管理專家。以下是目前所有專案問題（Issue）的資料。
請分析並提供：

1. 建議優先處理順序（考量截止日、優先級、問題嚴重性）
2. 可能的根因分析（基於問題描述和討論內容）
3. 改善方向建議

[Issue 資料]

請以繁體中文回覆，使用結構化格式。
```

### 回應格式
```json
{
  "priority_order": [
    { "issue_id": "...", "title": "...", "reason": "..." }
  ],
  "root_cause_analysis": "...",
  "improvement_suggestions": ["...", "..."]
}
```

---

## AI-03：KPI 趨勢預測

### API Route
`POST /api/ai/kpi-forecast`

### 流程
1. 驗證用戶為顧問角色
2. 檢查 rate limit
3. 收集所有 KPI 資料：指標定義 + 歷史月份記錄
4. 呼叫 Claude API 分析趨勢
5. 回傳預測結果
6. 記錄 AI 使用日誌

### Prompt 模板
```
你是一位數據分析專家。以下是專案 KPI 指標的歷史數據。
請分析每個指標的趨勢並提供：

1. 未來 1~2 個月的預測值
2. 趨勢判斷（上升/持平/下降）
3. 風險評估（哪些指標可能無法達標）
4. 改善建議

[KPI 資料]

請以繁體中文回覆，使用 JSON 格式。
```

### 回應格式
```json
{
  "forecasts": [
    {
      "kpi_id": "...",
      "kpi_name": "...",
      "predicted_values": [{ "month": 4, "value": 85 }],
      "trend": "上升",
      "risk_level": "low",
      "suggestion": "..."
    }
  ],
  "overall_assessment": "..."
}
```

---

## AI-04：智慧文件搜尋

### API Route
`POST /api/ai/document-search`

### 流程
1. 驗證用戶為顧問角色
2. 檢查 rate limit
3. 收集所有文件的 `content_summary` + 基本資訊
4. 將搜尋查詢 + 文件摘要送至 Claude API
5. 回傳相關文件排序 + 相關性說明
6. 記錄 AI 使用日誌

### Request Body
```json
{
  "query": "關於倉儲效率改善的報告"
}
```

### 回應格式
```json
{
  "results": [
    {
      "document_id": "...",
      "filename": "...",
      "relevance_score": 0.95,
      "relevance_reason": "此文件包含倉儲流程分析與效率改善方案"
    }
  ]
}
```

---

## 共用設計

### Rate Limiter（lib/ai/rate-limit.ts）
- 使用 in-memory Map 追蹤（Vercel serverless 環境足夠）
- Key：`{user_id}:{feature}`
- 限制：每功能每分鐘 5 次
- 超限回傳 HTTP 429

### AI UI 元件
- **ai-button.tsx**：紫色按鈕，✨ 圖示，loading 時顯示旋轉動畫
- **ai-result-panel.tsx**：右側滑出面板或內嵌卡片，紫色邊框，「AI 生成」標籤
- **ai-loading.tsx**：脈衝動畫 + 「AI 分析中...」文字

### 安全設計
- `ANTHROPIC_API_KEY` 存在 Vercel 環境變數
- 僅通過 Next.js API Routes（server-side）呼叫 Claude API
- 前端不暴露 API Key
- 所有 AI 呼叫記錄到 `ai_usage_logs` 和 `system_logs`

### 費用估算
- 模型：Claude Haiku（最低成本）
- 預估用量：每天 ~10 次 AI 呼叫
- 三個月預估費用：< $10 USD

---

## 驗收條件
- [ ] 四項 AI 功能皆可正常呼叫並回傳結果
- [ ] 僅顧問角色可觸發 AI 功能
- [ ] Rate limit 正確生效（超限回傳 429）
- [ ] AI 生成內容統一標記「AI 生成」
- [ ] AI 使用記錄正確寫入 ai_usage_logs
- [ ] API Key 不暴露在前端
- [ ] AI UI 元件正確顯示 loading 和結果狀態
