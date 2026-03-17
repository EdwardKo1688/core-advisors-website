# 富昇物流 × 企業顧問專案管理系統 — 開發指引

## 專案背景

這是一套為期三個月的企業顧問駐點管理系統，服務對象為富昇物流。
系統提供六大業務模組（儀表板、里程碑、週報、Issue、文件、KPI）、
四項 AI 輔助功能、三角色權限控制、文件中心與完整開發文件體系。

任務結束後：
- 完整程式碼與文件移交富昇 IT
- 顧問帶走系統架構作為可攜帶模板複用

## SDD 開發規範（Spec-Driven Development）

**核心原則：先 Spec 後 Code，不得跳過。**

### 變更流程
1. **提出變更**：`/opsx:propose <change-name>`
   - 產出 proposal.md（Why/What）
   - 產出 specs/（驗收條件）
   - 產出 design.md（技術方案）
   - 產出 tasks.md（原子化任務）
2. **確認規格**：顧問逐一審閱 proposal → design → tasks
3. **開始實作**：`/opsx:apply <change-name>`
4. **驗證完成**：每個 task 完成後立即驗證
5. **歸檔變更**：`/opsx:archive <change-name>`

### OpenSpec 文件位置
```
openspec/changes/<change-name>/
├── .openspec.yaml    # 變更元資料
├── proposal.md       # 商業需求
├── design.md         # 技術設計
├── tasks.md          # 任務分解
└── specs/            # 規格文件
```

## 技術棧

| 技術 | 用途 |
|------|------|
| Next.js 15 (App Router) | 全端框架 |
| TypeScript (strict) | 程式語言 |
| Tailwind CSS + shadcn/ui | 樣式與元件 |
| Supabase (PostgreSQL + RLS) | 資料庫 + 認證 + 儲存 |
| Claude API (@anthropic-ai/sdk) | AI 輔助功能 |
| Vercel | 部署 |
| Recharts | 圖表 |
| @dnd-kit | 拖曳 |

## 程式碼規範

### TypeScript
- 啟用 `strict: true`
- 所有函數明確標註回傳型別
- 禁止使用 `any`，必要時使用 `unknown` + type guard
- 使用 `interface` 定義物件結構

### 命名慣例
| 類型 | 規則 | 範例 |
|------|------|------|
| 元件 | PascalCase | `KanbanBoard.tsx` |
| 檔案 | kebab-case | `kanban-board.tsx` |
| API Route | kebab-case | `/api/weekly-reports` |
| 函數 | camelCase | `logAction()` |
| 常數 | UPPER_SNAKE | `MAX_FILE_SIZE` |
| 型別 | PascalCase | `MilestoneStatus` |
| 資料表 | snake_case | `weekly_reports` |
| 環境變數 | UPPER_SNAKE | `SUPABASE_URL` |

### 元件結構
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component function
// 4. Export
```

### API Route 結構
```typescript
// 1. Auth check (middleware)
// 2. Role validation
// 3. Input validation (zod)
// 4. Business logic
// 5. logAction()
// 6. Response
```

## 禁止事項

1. **不得跳過 Spec 直接寫程式碼** — 所有功能變更必須先 `/opsx:propose`
2. **不得在前端暴露 API Key** — ANTHROPIC_API_KEY 僅能在 server-side 使用
3. **不得硬編碼環境變數** — 所有敏感值存在 `.env.local`
4. **不得繞過 RLS** — 禁止使用 service_role_key 於前端
5. **不得刪除 system_logs 記錄** — append-only 設計
6. **不得跳過 logAction()** — 所有 CRUD/AUTH/EXPORT/AI 操作必須記錄
7. **不得直接修改 Supabase Schema** — 所有變更透過 migration SQL

## 驗證流程

每次完成程式碼修改後：
1. `npm run build` — 確認無編譯錯誤
2. `npm run lint` — 確認無 lint 錯誤
3. `npm test` — 確認所有測試通過
4. 手動測試三角色權限
5. 更新 CHANGELOG.md
