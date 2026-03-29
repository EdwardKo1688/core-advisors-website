# IC 診斷後台管理 — Phase 2 強化設計規格

**版本**：1.0.0
**狀態**：Phase 2 預留（設計完成，待 Phase 2 實作）
**覆蓋任務**：12.1 ~ 12.8
**建立日期**：2026-03-29

---

## 一、背景與範圍

Phase 1（MVP）已完成：
- 題庫管理（唯讀，從 JSON 載入）
- 權重設定（唯讀，含視覺化）
- 診斷規則（唯讀，含嚴重度顯示）
- 上傳模板（唯讀，含 CSV 下載）
- 欄位映射（唯讀，Phase 2 別名欄位預留）

Phase 2 需要強化為可編輯、版本管理、報告匯出、案件追蹤與多層權限系統。

---

## 二、12.1 題庫版本管理強化設計

### 2.1 功能目標
允許後台管理員在不重新部署的情況下，新增、停用、或修改診斷題目，並維護版本歷史。

### 2.2 版本管理結構

```json
{
  "_meta": {
    "version": "1.0.0",
    "changelog": [
      {
        "version": "1.0.0",
        "date": "2026-03-29",
        "author": "system",
        "changes": "初始版本，18 題 Sales / 17 題 PM / 16 題 FAE"
      }
    ]
  }
}
```

### 2.3 CRUD 操作設計

| 操作 | UI 入口 | 資料變更 | 版本行為 |
|------|---------|---------|---------|
| 新增題目 | 「+ 新增題目」→ 右側 Drawer 表單 | append to JSON | minor version +0.1 |
| 停用題目 | 列表操作欄 Toggle | `active: false` | patch version +0.0.1 |
| 編輯題目 | 列表點擊 → Drawer 表單 | 更新欄位 | patch version +0.0.1 |
| 刪除題目 | 確認 Modal → 軟刪除 | `deleted: true, deletedAt: ...` | patch version +0.0.1 |

### 2.4 Drawer 表單欄位

```
題目 ID（自動生成，格式：S-REV-05）
角色（Sales / PM / FAE）
模型（revenue / grossprofit / expense / contribution / capability）
子分類（result / quality / trend / synergy）
題目文字
答題類型（single / scale / text）
選項設定（1-5 分對應標籤）
權重（預設 1）
必填（是 / 否）
狀態（啟用 / 停用）
```

### 2.5 版本歷史 UI

- 頁面右上角顯示目前版本號（e.g., `v1.2.0`）
- 點擊版本號展開 Changelog Modal
- 每次儲存時自動記錄變更摘要

### 2.6 儲存策略（Phase 2 技術選型）

**選項 A**（推薦）：GAS Spreadsheet 作為題庫後端
- 題目存在 Google Sheets `IC_Questions` 工作表
- 版本號存在 `Config` 工作表
- 前台診斷時 fetch GAS API `/questions?role=sales`

**選項 B**：GitHub 直接 commit JSON
- 管理員在後台編輯後，觸發 GitHub API commit
- 需要 Personal Access Token 設定

---

## 三、12.2 權重版本管理強化設計

### 3.1 功能目標
允許管理員在後台直接調整角色別五模型權重，並記錄歷史版本，支援 A/B 測試。

### 3.2 可編輯權重 UI

```
角色：Sales 業務開發
┌─────────────────────────────────────────────┐
│ 模型         | 現值  | 調整  | 新值預覽      │
├─────────────────────────────────────────────┤
│ 營收模型     | 25%   | [25]  | ████░░ 25%   │
│ 毛利模型     | 25%   | [25]  | ████░░ 25%   │
│ 費效模型     | 10%   | [10]  | ██░░░░ 10%   │
│ 貢獻模型     | 25%   | [25]  | ████░░ 25%   │
│ 能力與協同   | 15%   | [15]  | ███░░░ 15%   │
├─────────────────────────────────────────────┤
│ 總計         | 100%  |       | 100%  ✅     │
└─────────────────────────────────────────────┘
[儲存變更] [重設為預設值]
```

### 3.3 驗證規則
- 三個角色各自五模型權重加總必須 = 100%
- 若加總不足 100%，顯示警告，禁止儲存
- 儲存時自動記錄版本 changelog

### 3.4 版本歷史與回滾
- 保留最近 10 個版本的權重快照
- 可一鍵回滾至任意歷史版本
- 每個版本顯示：日期、修改人、與前版本差異

---

## 四、12.3 規則管理強化設計

### 4.1 功能目標
允許管理員 CRUD 診斷規則，調整觸發條件閾值、嚴重度與行動建議。

### 4.2 規則列表強化

在現有唯讀表格基礎上新增：
- **展開行**：點擊規則行展開詳細條件 + 所有 actions
- **嚴重度篩選**：篩選 HIGH / MEDIUM / LOW
- **快速調整**：直接在列表編輯 priority 與 severity（下拉選單）

### 4.3 規則 CRUD Drawer

```
規則 ID（自動：RULE-07）
規則名稱
類別（profitability / efficiency / capability / collaboration）
適用角色（多選：sales / pm / fae）
嚴重度（high / medium / low）
優先級（1 / 2 / 3）
標記文字（flag，如「高支援低轉換」）

觸發條件：
  條件類型（AND / OR）
  條件 1：[模型] [子分類] [>= / <= / = / >] [值]
  條件 2：[+ 新增條件]

洞察說明（insight）
行動建議（最多 5 條，每條含文字 / 時程 / 優先級）
```

### 4.4 保守模式規則設計

保守模式（`conservativeMode.rules`）獨立顯示，標明閾值（預設 30%）可由管理員調整。

---

## 五、12.4 模板管理強化設計

### 5.1 功能目標
允許管理員新增、編輯、停用上傳模板，並管理每個模板的必填 / 選填欄位定義。

### 5.2 現有功能強化
Phase 1 已實作：
- ✅ 唯讀顯示所有模板
- ✅ 下載空白 CSV 模板

Phase 2 新增：
- 新增模板（Drawer 表單）
- 編輯模板欄位定義（動態增刪欄位）
- 停用模板（軟刪除，保留歷史上傳）
- 預覽模板（彈窗顯示欄位表格 + 下載）

### 5.3 模板 CRUD 表單

```
模板 ID（自動生成，格式：TPL-CUSTOM）
模板名稱
說明
類別（basic / revenue / profitability / capability）
適用角色（多選）
完備度權重（0.00–1.00，所有模板總計 = 1）

必填欄位：
  [欄位名稱] [顯示標籤] [類型] [驗證規則]
  [+ 新增必填欄位]

選填欄位：
  [欄位名稱] [顯示標籤] [類型] [驗證規則]
  [+ 新增選填欄位]
```

---

## 六、12.5 欄位映射管理設計

### 6.1 功能目標
允許管理員為每個標準欄位新增中文或客製化別名，讓用戶上傳時不需嚴格遵守英文欄位名。

### 6.2 現有功能
Phase 1 已實作：
- ✅ 顯示所有模板欄位（英文名 + 中文標籤 + 類型 + 驗證 + 必填 + 所屬模板）
- ✅ 篩選：依模板 / 必填選填

Phase 2 新增：
- 為每個欄位新增自定義別名列表（e.g., `年營收` → `annual_revenue`）
- 別名即時生效，Parser.applyFieldMapping 自動使用

### 6.3 別名管理 UI

```
欄位：annual_revenue（年營收（百萬TWD））
目前已接受別名：
  [年營收] [x]  [年收入] [x]  [revenue] [x]
  [+ 新增別名]
[儲存]
```

### 6.4 別名存儲設計

```json
{
  "fieldAliases": {
    "annual_revenue": ["年營收", "年收入", "revenue"],
    "gp_rate":        ["毛利率", "毛利", "GP%"],
    "customer_name":  ["客戶名稱", "客戶", "company"]
  }
}
```

儲存位置：`ic-diagnostic-data/field-aliases.json`（Phase 2 新建）

---

## 七、12.6 顧問案件列表設計

### 7.1 功能目標
將 IC 診斷紀錄、留資名單、預約確認整合為顧問案件，提供端到端諮詢漏斗追蹤。

### 7.2 案件狀態機

```
診斷完成 → [新案件] → 已聯繫 → 已預約 → 服務進行中 → 已完案
                                              ↓
                                         無跟進（停止）
```

### 7.3 案件資料結構

```json
{
  "caseId"        : "CASE-2026-001",
  "sessionId"     : "ICD-xxxxxxxxx",
  "leadId"        : "LEAD-xxxxxxxxx",
  "bookingId"     : "BK-xxxxxxxxx",
  "company"       : "ABC 科技有限公司",
  "contactName"   : "張三",
  "contactEmail"  : "chang@abc.com",
  "role"          : "sales",
  "maturityLevel" : "C",
  "score"         : 62,
  "topRisks"      : ["RULE-01", "RULE-03"],
  "status"        : "booked",
  "assignedTo"    : "consultant@core.tw",
  "consultantNote": "客戶主要痛點為毛利侵蝕，已排定第一次深度診斷。",
  "nextFollowUp"  : "2026-04-15",
  "closedAt"      : null,
  "createdAt"     : "2026-03-29T10:00:00Z",
  "updatedAt"     : "2026-03-30T09:00:00Z"
}
```

### 7.4 案件列表 UI

| 案件 ID | 公司 | 角色 | 等級 | 分數 | 狀態 | 負責顧問 | 下次跟進 | 操作 |
|---------|------|------|------|------|------|---------|---------|------|
| CASE-001 | ABC 科技 | Sales | C | 62 | 已預約 | ... | 04/15 | [詳情] |

轉換漏斗看板（儀表板子區塊）：
```
診斷完成  留資  預約確認  服務中  已完案
  100  →  45  →   28   →   15  →   8     （本季）
         45%     62%      53%      53%    （各階段轉換率）
```

---

## 八、12.7 報告匯出設計

### 8.1 功能目標
支援三種報告匯出格式，服務不同使用場景。

### 8.2 報告類型

| 報告 | 用途 | 格式 | 觸發點 |
|------|------|------|--------|
| 診斷摘要報告 | 提供給客戶的個人化報告 | PDF | 結果頁 + 後台 |
| 批次資料匯出 | 內部數據分析 | Excel | 後台 ic-sessions tab |
| 週期統計報告 | 管理層回顧 | PDF + Excel | 後台 ic-export tab |

### 8.3 PDF 診斷報告結構

```
╔══════════════════════════════════════╗
║  IC 產業人才轉型診斷報告             ║
║  ABC 科技有限公司 | Sales 角色       ║
║  2026-03-29                         ║
╚══════════════════════════════════════╝

第 2 頁：成熟度概覽
  ● 總分：62 / 100
  ● 等級：Level C 轉型起步
  ● 雷達圖（五模型分數）
  ● 五模型分數條形圖

第 3 頁：Top-3 風險分析
  ▲ HIGH   RULE-01 高營收低毛利
           觸發條件：revenue ≥ 3.5 且 grossprofit ≤ 2.5
           洞察說明：...

第 4 頁：Top-5 行動建議
  P1 盤點前 10 大客戶毛利率    [2 週內]
  P1 建立毛利底線機制          [1 個月內]
  ...

第 5 頁：評分方法說明
  三角色 × 五模型架構說明
  題目分數計算方式
  報告版本資訊
```

### 8.4 技術選型

**PDF 生成**：`jsPDF` + `html2canvas`（前端 CDN）
- 結果頁截圖 + 匯出 — 最簡實作
- 或：後端 GAS + `Utilities.newBlob` 生成格式化報告

**Excel 匯出**：`SheetJS`（已在 Phase 2 ic-diagnostic-service.js 中預留 stub）

---

## 九、12.8 角色權限細分設計

### 9.1 功能目標
支援系統管理員、資深顧問、顧問、檢視者四個層級，不同層級對不同模組有不同讀寫權限。

### 9.2 角色權限矩陣

| 功能模組 | 系統管理員 | 資深顧問 | 顧問 | 檢視者 |
|---------|-----------|---------|------|--------|
| 儀表板 | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 唯讀 |
| AI 診斷紀錄 | ✅ CRUD | ✅ 讀+備注 | ✅ 唯讀 | ❌ |
| IC 診斷紀錄 | ✅ CRUD | ✅ 讀+備注 | ✅ 唯讀 | ❌ |
| 留資名單 | ✅ CRUD | ✅ 讀+狀態 | ✅ 唯讀 | ❌ |
| 預約管理 | ✅ CRUD | ✅ CRUD | ✅ 唯讀 | ❌ |
| 顧問案件 | ✅ CRUD | ✅ 負責案件 | ✅ 唯讀 | ❌ |
| 題庫/權重/規則 | ✅ CRUD | ❌ | ❌ | ❌ |
| 模板/欄位映射 | ✅ CRUD | ❌ | ❌ | ❌ |
| 報告匯出 | ✅ 所有 | ✅ 負責案件 | ❌ | ❌ |
| 系統設定/API | ✅ 完整 | ❌ | ❌ | ❌ |

### 9.3 實作方案

**GAS 側**：
```javascript
// login API 回傳 role
{ success: true, token: "...", role: "senior_consultant" }
```

**前端 admin.js 側**：
```javascript
const ROLE_PERMISSIONS = {
  admin:             ['all'],
  senior_consultant: ['dashboard','records','bookings','ic-sessions','ic-leads',
                      'ic-uploads','ic-cases','ic-export','cms'],
  consultant:        ['dashboard','records','bookings','ic-sessions'],
  viewer:            ['dashboard']
};

function filterNavByRole(role) {
  if (role === 'admin') return; // show all
  const allowed = ROLE_PERMISSIONS[role] || [];
  document.querySelectorAll('.admin-nav-item[data-tab]').forEach(item => {
    const tab = item.dataset.tab;
    if (!allowed.includes(tab)) item.style.display = 'none';
  });
}
```

**localStorage 側**：
```javascript
// 儲存 token 時同時儲存 role
localStorage.setItem('admin_role', data.role);
```

### 9.4 密碼分層（簡易版）

在 GAS Config 工作表設定多個帳號：
```
password_hash    | role
sha256(admin123) | admin
sha256(consult1) | senior_consultant
sha256(view2026) | viewer
```

---

## 十、實作優先順序建議

| 優先級 | 任務 | 工時估算 | 依賴 |
|--------|------|---------|------|
| P1 | 12.5 欄位別名（field-aliases.json + UI）| 0.5 天 | 無 |
| P1 | 12.8 角色權限（前端 filterNavByRole）| 1 天 | GAS 登入 API 擴充 |
| P2 | 12.2 權重線上編輯 + 儲存 | 1 天 | GAS API 擴充 |
| P2 | 12.7 PDF 報告（jsPDF）| 2 天 | 無 |
| P2 | 12.6 顧問案件列表 | 2 天 | GAS 新工作表 |
| P3 | 12.1 題庫 CRUD | 2 天 | GAS API + 12.8 |
| P3 | 12.3 規則 CRUD | 1.5 天 | GAS API + 12.8 |
| P3 | 12.4 模板 CRUD | 1 天 | GAS API + 12.8 |

**總估算**：Phase 2 約 10–11 人天

---

## 十一、Phase 2 技術前提

1. **GAS API 擴充**：登入 API 回傳 `role`；新增 `/questions`, `/weights`, `/rules`, `/templates`, `/cases` CRUD endpoints
2. **Google Sheets 擴充**：新增 `IC_Questions`, `IC_Rules`, `IC_Cases` 工作表
3. **前端依賴新增**：`jsPDF` + `html2canvas`（PDF 匯出）；`SheetJS`（Excel 匯出）
4. **field-aliases.json**：新建 `ic-diagnostic-data/field-aliases.json`

---

*此規格文件對應 tasks.md Phase 12（十二、Phase 2 預留），作為 Phase 2 開發的設計基準。*
