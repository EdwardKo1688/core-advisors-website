# SPEC: SYSTEM — 認證與角色權限

## 基本資訊
- **技術**：Supabase Auth（Email + Password）
- **資料表**：`user_profiles`
- **權限機制**：Row Level Security (RLS)

---

## 資料表 Schema

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'manager'
    CHECK (role IN ('consultant', 'manager', 'reviewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 三角色定義

### 顧問（consultant）— 管理員
- 系統唯一管理員
- 完整 CRUD 所有模組資料
- 觸發 AI 輔助功能
- 管理 KPI 指標
- 上傳/刪除文件
- 拖曳 Issue 看板
- 編輯本週摘要

### 主管（manager）— 檢視者
- 唯讀瀏覽所有模組
- 可在週報和 Issue 下方留言
- 可匯出 PDF/CSV
- 不可修改任何資料

### 審核者（reviewer）— 簽核者
- 唯讀瀏覽所有模組
- 可在週報和 Issue 下方留言
- 可提交審核意見（approval_records）
- 可匯出 PDF/CSV
- 不可修改任何資料

---

## 權限矩陣

| 操作 | 顧問 | 主管 | 審核者 |
|------|------|------|--------|
| 檢視所有模組 | ✅ | ✅ | ✅ |
| 新增/編輯/刪除資料 | ✅ | ❌ | ❌ |
| 拖曳 Issue 看板 | ✅ | ❌ | ❌ |
| 上傳文件 | ✅ | ❌ | ❌ |
| 刪除文件 | ✅ | ❌ | ❌ |
| 管理 KPI 指標 | ✅ | ❌ | ❌ |
| 觸發 AI 功能 | ✅ | ❌ | ❌ |
| 留言（週報/Issue） | ✅ | ✅ | ✅ |
| 審核簽核 | ❌ | ❌ | ✅ |
| 匯出 PDF/CSV | ✅ | ✅ | ✅ |
| 查看系統日誌 | ✅ | ✅ | ✅ |

---

## RLS Policy 設計

### 通用模式
```sql
-- SELECT: 所有已認證用戶可讀
CREATE POLICY "authenticated_read" ON {table}
  FOR SELECT USING (auth.role() = 'authenticated');

-- INSERT/UPDATE/DELETE: 僅顧問角色
CREATE POLICY "consultant_write" ON {table}
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'consultant'
    )
  );
```

### 留言特殊規則
```sql
-- 三角色皆可新增留言
CREATE POLICY "authenticated_insert_comments" ON report_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 留言不可編輯或刪除
```

### system_logs 特殊規則
```sql
-- 僅允許 INSERT（append-only）
CREATE POLICY "insert_only" ON system_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- SELECT: 所有已認證用戶可讀
CREATE POLICY "authenticated_read" ON system_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- 無 UPDATE/DELETE policy
```

---

## 登入頁設計

### UI 規格
- 頁面標題：「富昇物流 × 顧問專案管理系統」
- 副標題：「Fusheng Logistics × Consultant Project Management」
- 背景色：深藍 #1e3a5f
- 登入表單：Email + Password
- 登入按鈕：靛藍 #3b82f6
- 錯誤提示：紅色文字

### Session 管理
- 使用 Supabase cookie-based session
- 關閉瀏覽器後重開不需重新登入
- Session 過期時間：30 天
- 登出時清除 session

### 預設帳號
| Email | Password | 角色 |
|-------|----------|------|
| consultant@fusheng.com | consultant123 | 顧問 |
| manager@fusheng.com | manager123 | 主管 |
| reviewer@fusheng.com | reviewer123 | 審核者 |

---

## 驗收條件
- [ ] 三個帳號皆可正常登入
- [ ] 登入後正確顯示角色名稱
- [ ] 顧問可操作所有 CRUD 功能
- [ ] 主管僅能檢視和留言
- [ ] 審核者僅能檢視、留言、簽核
- [ ] RLS 正確隔離權限（直接 DB 查詢測試）
- [ ] Session 持久化正常（關閉重開不需登入）
- [ ] 登出後無法存取系統
