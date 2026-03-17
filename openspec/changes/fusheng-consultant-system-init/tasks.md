# Tasks: 富昇物流 × 企業顧問專案管理系統

## 總覽
- **總任務數**：66 個原子化 tasks
- **階段數**：9 個 Phase（Phase 0 ~ Phase 8）
- **每個 task 皆可獨立驗證**

---

## Phase 0：專案初始化

### 0.1 建立 Next.js 15 專案
- [x] 建立 `fusheng-consultant/` 專案（TypeScript + Tailwind + App Router）
- [x] 確認 `app/` 目錄結構正確
- [x] 確認 TypeScript strict mode 啟用
- **驗證**：`npm run build` 通過 ✅

### 0.2 安裝所有依賴套件
- [x] 安裝 production 依賴（supabase, anthropic, recharts, dnd-kit, papaparse, mermaid, etc.）
- [x] 安裝 dev 依賴（@types/papaparse）
- [x] 初始化 shadcn/ui
- [x] 安裝 13 個 shadcn/ui 元件（button, card, dialog, input, select, skeleton, table, textarea, badge, dropdown-menu, separator, tabs, tooltip）
- **驗證**：`npm run build` 通過 ✅

### 0.3 建立 Supabase 專案並設定環境變數
- [x] 建立 `.env.local`（含 SUPABASE_URL, SUPABASE_ANON_KEY, ANTHROPIC_API_KEY placeholder）
- [x] 建立 `.env.example`（不含實際值）
- [x] 確認 `.env.local` 在 `.gitignore` 中
- [ ] 在 Supabase Dashboard 建立新專案並替換實際值（需用戶操作）
- **驗證**：環境變數檔案已建立 ✅

### 0.4 建立 CLAUDE.md
- [x] 撰寫專案背景說明
- [x] 撰寫 SDD 開發規範
- [x] 撰寫程式碼規範（TypeScript strict, naming conventions）
- [x] 撰寫禁止事項
- **驗證**：CLAUDE.md 內容完整 ✅

---

## Phase 1：資料庫與認證

### 1.1 建立所有 Supabase 資料表
- [x] 撰寫 `supabase/migrations/001_initial_schema.sql`
- [x] 建立 15 張資料表（含所有 FK 關聯、索引、CHECK 約束）
- [ ] 在 Supabase Dashboard 執行 migration（需用戶操作）
- **驗證**：SQL 已撰寫 ✅

### 1.2 設定所有資料表的 RLS Policy
- [x] 撰寫 `supabase/migrations/002_rls_policies.sql`
- [x] 為每張表設定 SELECT/INSERT/UPDATE/DELETE policy
- [x] system_logs: append-only（僅 INSERT）
- [x] report_comments / issue_comments: 三角色皆可 INSERT
- [x] approval_records: 僅 reviewer 可 INSERT
- **驗證**：SQL 已撰寫 ✅

### 1.3 建立三個預設帳號
- [x] 撰寫 `supabase/migrations/003_seed_data.sql`（含初始資料 + 說明）
- [ ] 在 Supabase Auth 建立三個用戶（需用戶操作）
- [x] 插入 project_settings 初始記錄
- [x] 插入範例里程碑（12 週）
- [x] 插入範例 KPI 定義（6 項）
- **驗證**：SQL 已撰寫 ✅

### 1.4 實作 logAction() utility
- [x] 建立 `lib/log-action.ts`
- [x] 實作 `logAction()` 函數（TypeScript 介面 + Supabase 寫入）
- [x] 錯誤時靜默失敗（try-catch, 不阻斷主要操作）
- **驗證**：程式碼已完成 ✅

---

## Phase 2：版面與路由

### 2.1 建立側邊欄導航元件
- [x] 建立 `components/layout/sidebar.tsx`
- [x] 導航項目：儀表板、里程碑、週報、Issue、文件、KPI、文件中心
- [x] 手機版折疊為 64px（僅圖示）
- [x] 當前頁面高亮
- **驗證**：程式碼已完成 ✅

### 2.2 建立所有頁面路由結構
- [x] 建立所有 `page.tsx`（含完整功能頁面）
- [x] 建立 `app/layout.tsx`（Root layout）
- [x] 建立 `app/(main)/layout.tsx`（Sidebar + Header + AuthProvider）
- [x] 建立 `components/layout/header.tsx`（專案名稱 + 角色 + 登出）
- [x] 建立 `docs-center/layout.tsx`
- **驗證**：程式碼已完成 ✅

### 2.3 實作登入/登出功能
- [x] 建立 `app/login/page.tsx`（登入表單 UI）
- [x] 建立 `components/layout/auth-provider.tsx`（Auth context）
- [x] 建立 `lib/supabase/client.ts`（Browser client）
- [x] 建立 `lib/supabase/server.ts`（Server client）
- [x] 實作登入邏輯（Supabase Auth signInWithPassword）
- [x] 實作登出邏輯（signOut）
- **驗證**：程式碼已完成 ✅

### 2.4 實作角色權限路由保護
- [x] 建立 `middleware.ts`（Next.js root middleware）
- [x] 未登入用戶 → 重定向到 `/login`
- [x] 登入後 `/login` → 重定向到 `/dashboard`
- [x] 建立 `lib/auth.ts`（角色檢查 helper）
- **驗證**：程式碼已完成 ✅

---

## Phase 3：六大業務模組

### MODULE-01 專案總覽儀表板

#### 3.1.1~3.1.4 專案總覽儀表板（整合為單一頁面）
- [x] 建立 `app/(main)/dashboard/page.tsx`
- [x] 專案基本資訊卡片 + 進度百分比 + 進度條
- [x] 里程碑逾期警示（紅/黃/綠色）
- [x] 最新三則 Issue 預覽
- [x] 剩餘天數 + 登入角色顯示
- **驗證**：程式碼已完成 ✅

### MODULE-02 時程里程碑管理

#### 3.2.1~3.2.4 時程里程碑管理（整合為單一頁面）
- [x] 建立 `app/(main)/milestones/page.tsx`
- [x] CSS Grid 甘特圖（三色標示 + 今日線）
- [x] CRUD 表單（Dialog 式新增/編輯）
- [x] 整體進度百分比 + 狀態選擇
- [x] 里程碑列表視圖
- **驗證**：程式碼已完成 ✅

### MODULE-03 每週進度週報

#### 3.3.1~3.3.5 每週進度週報（整合為單一頁面）
- [x] 建立 `app/(main)/weekly-reports/page.tsx`
- [x] 四欄位表單 + 自動週次標記
- [x] AI 自動草稿按鈕（呼叫 /api/ai/weekly-summary）
- [x] 歷史週報時間軸列表
- [x] AI 生成標籤
- [ ] PDF 匯出（待後續增強）
- [ ] 週報留言功能（待後續增強）
- **驗證**：核心功能已完成 ✅

### MODULE-04 問題與待辦追蹤

#### 3.4.1~3.4.5 問題與待辦追蹤（整合為單一頁面）
- [x] 建立 `app/(main)/issues/page.tsx`
- [x] Kanban 三欄佈局 + 計數
- [x] CRUD 表單 + 狀態切換按鈕
- [x] 優先級篩選器
- [x] 角色權限控制（僅顧問可操作）
- [x] AI 分析 API route（`/api/ai/issue-analysis`）
- [ ] @dnd-kit 拖曳實作（使用按鈕替代）
- [ ] Issue 留言功能（待後續增強）
- **驗證**：核心功能已完成 ✅

### MODULE-05 交付文件管理

#### 3.5.1~3.5.4 交付文件管理（整合為單一頁面）
- [x] 建立 `app/(main)/documents/page.tsx`
- [x] 文件上傳（副檔名白名單 + 50MB 限制 + Supabase Storage）
- [x] 文件列表 + 分類標籤篩選
- [x] 版本號顯示 + 檔案大小
- [x] 刪除功能（僅管理員）
- [x] AI 智慧搜尋（`/api/ai/document-search`）
- [ ] PDF iframe 預覽（待後續增強）
- [ ] 版本自動遞增管理（待後續增強）
- **驗證**：核心功能已完成 ✅

### MODULE-06 KPI 成效儀表板

#### 3.6.1~3.6.4 KPI 成效儀表板（整合為單一頁面）
- [x] 建立 `app/(main)/kpi/page.tsx`
- [x] KPI 指標 CRUD（名稱/單位/目標值/基準值）
- [x] 每月數值輸入表單（Dialog 式）
- [x] 達成率自動計算
- [x] KPI 卡片網格（基準/目標/達成率 + 歷史記錄）
- [x] AI 趨勢預測按鈕（`/api/ai/kpi-forecast`）
- [ ] Recharts 折線圖（待後續增強）
- **驗證**：核心功能已完成 ✅

---

## Phase 4：文件中心五個子頁面

### /docs-center/architecture

#### 4.1 架構頁
- [x] 建立 `app/(main)/docs-center/architecture/page.tsx`
- [x] ASCII 系統架構圖 + 技術棧表格 + 環境變數清單
- **驗證**：程式碼已完成 ✅

#### 4.2 變更紀錄
- [x] 建立 `app/(main)/docs-center/changelog/page.tsx`
- [x] 版本卡片式展示（色塊區分）
- **驗證**：程式碼已完成 ✅

#### 4.3 測試紀錄
- [x] 建立 `app/(main)/docs-center/test-records/page.tsx`
- [x] 統計（Pass/Fail/Pending 計數）
- [x] UAT CRUD 表單
- **驗證**：程式碼已完成 ✅

#### 4.4 系統日誌
- [x] 建立 `app/(main)/docs-center/logs/page.tsx`
- [x] 篩選器（操作類型 + 模組）+ 分頁
- [x] old_value vs new_value diff 展開
- [x] CSV 匯出
- **驗證**：程式碼已完成 ✅

#### 4.5 使用手冊
- [x] 建立 `app/(main)/docs-center/user-manual/page.tsx`
- [x] 三章內容（系統概述/六大模組/AI 功能）
- [ ] 搜尋高亮 + PDF 匯出（待後續增強）
- **驗證**：核心內容已完成 ✅

---

## Phase 5：AI 基礎設施

### 5.0.1 Claude API Client + Prompt 模板
- [x] 建立 `lib/ai/client.ts`（@anthropic-ai/sdk 初始化 + Haiku 模型）
- [x] 建立 `lib/ai/prompts.ts`（四項功能的 prompt 模板）
- **驗證**：程式碼已完成 ✅

### 5.0.2 Rate Limiter + AI Usage Logging
- [x] 建立 `lib/ai/rate-limit.ts`（in-memory Map）
- [x] 每功能每分鐘 5 次限制 + HTTP 429
- [x] AI 使用記錄寫入 ai_usage_logs（在各 API route 中實作）
- **驗證**：程式碼已完成 ✅

### 5.0.3 四項 AI API Routes
- [x] `app/api/ai/weekly-summary/route.ts`
- [x] `app/api/ai/issue-analysis/route.ts`
- [x] `app/api/ai/kpi-forecast/route.ts`
- [x] `app/api/ai/document-search/route.ts`
- [x] 所有 route 含 Auth + Role check + Rate limit + logAction
- **驗證**：程式碼已完成 ✅

---

## Phase 6：測試

### 6.1 安裝測試框架
- [ ] 設定 Jest + Testing Library
- [ ] 設定 Playwright
- [ ] 建立測試設定檔
- **驗證**：`npm test` 可執行

### 6.2 API Routes 單元測試
- [ ] 為所有 CRUD API routes 寫測試
- [ ] 為 AI API routes 寫測試（mock Claude API）
- [ ] 測試角色權限隔離
- **驗證**：所有測試通過

### 6.3 E2E 測試
- [ ] 登入流程（三角色）
- [ ] 里程碑 CRUD 流程
- [ ] 週報建立 + 留言
- [ ] Issue Kanban 拖曳
- [ ] 文件上傳 + 下載
- [ ] KPI 數值輸入
- **驗證**：所有 E2E 測試通過

---

## Phase 7：文件輸出

### 7.1 ARCHITECTURE.md
- [ ] 系統架構說明（含三層架構圖、AI 架構）
- [ ] 技術棧清單
- [ ] 資料庫設計說明
- **驗證**：文件完整

### 7.2 CHANGELOG.md
- [ ] 初始版本 v1.0.0
- [ ] Keep a Changelog 格式
- [ ] 列出所有初始功能（Added 區塊）
- **驗證**：格式正確

### 7.3 USER_MANUAL.md
- [ ] 三角色操作指南
- [ ] AI 功能使用說明
- [ ] 截圖/示意圖
- **驗證**：內容完整且可讀

### 7.4 ADR-001-tech-stack.md
- [ ] 技術選型決策記錄
- [ ] 備選方案比較
- [ ] 決策理由
- **驗證**：ADR 格式正確

### 7.5 ADR-002-database-design.md
- [ ] 資料庫設計決策記錄
- [ ] 資料表關聯說明
- [ ] RLS 策略說明
- **驗證**：ADR 格式正確

---

## Phase 8：部署

### 8.1 推上 GitHub
- [ ] 建立 GitHub repository
- [ ] 推送所有程式碼
- [ ] 確認 .env.local 不在 git 中
- **驗證**：GitHub repo 正確

### 8.2 連結 Vercel
- [ ] 在 Vercel 連結 GitHub repo
- [ ] 設定環境變數（SUPABASE_URL, SUPABASE_ANON_KEY, ANTHROPIC_API_KEY 等）
- [ ] 觸發首次部署
- **驗證**：Vercel 部署成功

### 8.3 驗證線上版本
- [ ] 三個帳號登入測試
- [ ] 六大模組基本操作驗證
- [ ] 四項 AI 功能驗證
- [ ] 文件中心頁面驗證
- [ ] 響應式佈局驗證
- **驗證**：所有功能正常運行
