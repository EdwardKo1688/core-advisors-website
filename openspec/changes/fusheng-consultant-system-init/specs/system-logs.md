# SPEC: SYSTEM — 系統日誌（System Logs）

## 基本資訊
- **資料表**：`system_logs`
- **存取方式**：`logAction()` utility function
- **查詢介面**：`/docs-center/logs`
- **安全**：Append-only（僅允許寫入，不可修改或刪除）

---

## 資料表 Schema

```sql
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  user_id UUID,
  user_role TEXT,
  action TEXT NOT NULL
    CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'AI_GENERATE')),
  module TEXT NOT NULL,
  record_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT
);

-- Append-only: 僅允許 INSERT
CREATE POLICY "insert_only" ON system_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read" ON system_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- 建立索引加速查詢
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX idx_system_logs_module ON system_logs(module);
CREATE INDEX idx_system_logs_action ON system_logs(action);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
```

---

## logAction() Utility Function

### 介面定義
```typescript
// lib/log-action.ts

interface LogActionParams {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'AI_GENERATE';
  module: string;      // 'milestones' | 'weekly_reports' | 'issues' | 'documents' | 'kpi' | 'auth' | 'ai'
  recordId?: string;   // 操作對象的 UUID
  oldValue?: object;   // UPDATE 時的舊值
  newValue?: object;   // CREATE/UPDATE 時的新值
}

async function logAction(params: LogActionParams): Promise<void>
```

### 實作要點
- 從 Supabase session 取得 `user_id` 和 `user_role`
- 從 request headers 取得 `ip_address` 和 `user_agent`
- 在所有 API routes 的 CRUD 操作後呼叫
- 錯誤時靜默失敗（log 失敗不應阻斷主要操作）
- 不記錄 `old_value`/`new_value` 中的敏感資訊（如密碼）

---

## 記錄的操作類型

| Action | 觸發時機 | module 值 | 記錄內容 |
|--------|----------|-----------|----------|
| CREATE | 新增資料 | 對應模組名 | new_value: 新增的資料 |
| UPDATE | 修改資料 | 對應模組名 | old_value + new_value |
| DELETE | 刪除資料 | 對應模組名 | old_value: 刪除前的資料 |
| LOGIN | 使用者登入 | auth | new_value: { email, role } |
| LOGOUT | 使用者登出 | auth | — |
| EXPORT | 匯出 PDF/CSV | 對應模組名 | new_value: { format, filename } |
| AI_GENERATE | AI 功能觸發 | ai | new_value: { feature, model, tokens } |

---

## 驗收條件
- [ ] 所有 CRUD 操作自動寫入 system_logs
- [ ] LOGIN/LOGOUT 正確記錄
- [ ] EXPORT 操作正確記錄
- [ ] AI_GENERATE 操作正確記錄
- [ ] old_value 和 new_value 正確記錄變更差異
- [ ] logAction() 失敗時不影響主要操作
- [ ] 資料表為 append-only（無法 UPDATE/DELETE）
- [ ] 索引正確建立，查詢效能良好
