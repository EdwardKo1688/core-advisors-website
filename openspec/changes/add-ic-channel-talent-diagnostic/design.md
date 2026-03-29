## 一、設計前提

本工具在設計與實作前，已完成現有網站盤點。

已確認的現況：
- admin.html 內嵌登入表單可沿用，需擴充後台 Tab
- 現有 5 個後台 Tab 可保留，新增 IC 診斷管理模組
- GAS 後端架構可沿用，需擴充 endpoint
- 前台 Navbar、tools.html 工具卡片、navigator.html 入口結構可直接整合
- 全站無檔案上傳功能，需新建
- CSS McKinsey 風格變數完整可直接引用

設計原則：
1. 前台工具需與現有網站一致整合
2. 後台以「可沿用則沿用、不可沿用則新建」為原則
3. 第一階段即需具備最小可用管理後台

## 二、產品定位

本工具為核心顧問網站中的垂直產業診斷模組，服務對象聚焦於 IC 通路商、半導體代理商、原廠通路組織與其主管團隊。

本工具透過三角色 × 五模型架構，結合問卷輸入與基礎資料上傳，快速呈現企業現況、轉型風險、協同落差與優先改善方向，並導入後續顧問服務與後台管理。

本工具需適用不同數位化成熟度的企業，不得假設企業已具備完整 ERP、CRM、BI 或其他高成熟度資訊基礎。

## 三、使用者類型

### 前台使用者
- Sales、PM、FAE、管理者、潛在企業客戶

### 後台使用者
- 管理員、顧問管理者、工具內容管理者

## 四、輸入模式設計

### Mode A：問卷模式
適用於低數位成熟度公司、尚無完整資料可上傳者。

### Mode B：問卷 + 基礎資料上傳模式
適用於已有 Excel、CSV、部門報表者。

### Mode C：進階整合模式
適用於後續企業版客戶，不屬於 Phase 1 實作範圍。

## 五、前台資訊架構

### 前台路由
- `ic-diagnostic.html` — 工具介紹 + 開始診斷入口
- `ic-diagnostic.html#start` — 角色選擇 + 多步驟問卷
- `ic-diagnostic.html#upload` — 資料上傳（Mode B）
- `ic-diagnostic.html#result` — 診斷結果頁

### 前台整合
1. 在 tools.html 新增工具卡
2. 在 navigator.html 新增 IC 產業入口
3. 在 solutions.html 加入導流說明
4. 使用現有網站 CTA 風格與顧問語氣
5. 維持核心顧問主品牌，不建立獨立品牌站

## 六、後台資訊架構

### 後台整合方案
擴充現有 admin.html SPA，新增 IC 診斷管理 Tab 群組。

### 後台模組

| 模組 | 功能 |
|------|------|
| Login | 沿用現有管理員登入、Session 保護 |
| Dashboard | 新增 IC 診斷數量摘要、留資數量、上傳成功率、待處理案件 |
| Sessions | IC 診斷紀錄列表，依角色/日期/公司篩選，查看分數/成熟度/風險/建議 |
| Leads | 留資名單列表、聯絡資料、來源追蹤、狀態標記 |
| Uploads | 檔案上傳紀錄、格式驗證結果、欄位映射結果、解析狀態 |
| Questions | 題庫列表、依角色與模型分類、啟用/停用、版本管理 |
| Weights | 角色權重設定、權重版本管理 |
| Rules | 診斷規則列表、嚴重度、訊息與建議設定 |
| Templates | 上傳模板列表、必填/選填欄位、模板版本 |
| Reports | 結果查看、顧問解讀前檢視、後續匯出預留 |

## 七、三角色定義

### Sales
客戶開發、客戶經營、專案取得、訂單與營收毛利達成

### PM
產品線經營、原廠關係管理、價格與策略管理、forecast/funnel/inventory 管理

### FAE
技術支援、設計導入、問題排除、design-win 技術貢獻

## 八、五模型定義

| 模型 | 評估面向 |
|------|---------|
| Model 1 營收模型 | 規模、成長與營收達成 |
| Model 2 毛利模型 | 獲利品質與價格健康度 |
| Model 3 費效模型 | 費用投入效率 |
| Model 4 貢獻模型 | 實際商業貢獻 |
| Model 5 能力與協同模型 | 角色能力成熟度與跨部門協同品質 |

## 九、角色權重設計

| 模型 | Sales | PM | FAE |
|------|-------|-----|-----|
| 營收 | 25% | 15% | 10% |
| 毛利 | 25% | 25% | 15% |
| 費效 | 10% | 15% | 10% |
| 貢獻 | 25% | 25% | 40% |
| 能力與協同 | 15% | 20% | 25% |

權重為暫定值，須集中由 SCORING_CONFIG 管理，不得硬寫死在分散的 JavaScript 邏輯中，後續可依顧問實測結果調整。

## 十、模型分數結構

```
模型總分 = 結果分 × 40% + 品質分 × 25% + 趨勢分 × 15% + 協同分 × 20%
整體總分 = 五模型總分依角色權重加總
```

各子分數權重同樣集中於 SCORING_CONFIG 管理。

## 十一、資料上傳設計

### 支援格式
Excel (.xlsx)、CSV (.csv)

### 初版模板範圍
公司基本資料、角色/人員清單、客戶資料、產品線資料、專案資料、營收資料、毛利資料、費用資料、forecast/funnel 資料、支援活動資料

### 原則
1. 不需一次上傳全部資料
2. 可逐步補充
3. 缺資料仍可完成分析
4. 上傳資料作為精度補強
5. 不可因資料不完整阻斷使用

## 十二、規則引擎

| 規則 | 觸發條件 | 輸出 |
|------|---------|------|
| 高營收低毛利 | 營收達成高 + 毛利率低於門檻 | 價格與客戶結構風險 |
| 高支援低轉換 | FAE 支援數高 + design-win 低 | 支援資源配置風險 |
| 預測品質偏弱 | forecast accuracy 偏低 + 庫存升高 | PM 預測與配置風險 |
| 費用投入無效 | 經營費用增加 + 客戶成果未同步成長 | 投入效率風險 |

規則閾值集中於 SCORING_CONFIG.ruleThresholds 管理。

## 十三、成熟度分級

| 等級 | 分數範圍 | 標籤 |
|------|---------|------|
| Level A | >= 85 | 成熟領先 |
| Level B | 70–84 | 穩定可優化 |
| Level C | 55–69 | 轉型起步 |
| Level D | < 55 | 高風險待改善 |

## 十四、結果頁設計

排列順序：
1. 診斷摘要（Executive Summary）
2. 總分與成熟度等級
3. 五模型雷達圖
4. 三大風險
5. 三大改善建議
6. 建議下一步顧問服務
7. 資料完備度說明
8. 留資表單
9. 預約顧問 CTA

## 十五、CTA 設計

- **主 CTA**：預約顧問深度診斷 → booking.html，附帶 `ic_scenario`、`ic_health`、`ic_risks` 參數
- **次 CTA**：複製診斷摘要
- **次次 CTA**：重新診斷

預約顧問時附帶本次診斷摘要（角色、成熟度等級、三大風險），讓顧問在接手前先理解案件輪廓，提高後續諮詢效率。

## 十六、資料模型

### Question
id, role, model, category, question_text, answer_type, options, weight, required, active

### WeightSchema
id, role_code, revenue_weight, gp_weight, expense_weight, contribution_weight, capability_weight, effective_from

### DiagnosticRule
id, role_scope, condition_json, severity, message, suggestion

### UploadTemplate
id, template_name, description, required_fields, optional_fields, version, active

### UploadedDataset
id, session_id, template_id, file_name, file_type, validation_result, mapping_json, parsed_data_json, uploaded_at

### DiagnosticSession
id, user_role, input_mode, answers_json, score_json, risk_json, recommendation_json, maturity_level, data_completeness, created_at

### Lead
id, company_name, name, title, email, phone, consent, source, session_id, created_at

## 十七、權限與安全原則

1. 後台頁面需受登入保護
2. 未登入不得訪問後台管理區
3. Phase 1 採基本管理員權限
4. Phase 2 再細分顧問與管理者權限
5. 上傳檔案需有格式驗證與錯誤處理

## 十八、技術設計原則

1. 前端採模組化元件設計
2. 題庫、權重、規則、模板以設定化方式管理（JSON 設定檔）
3. 行動版優先
4. 結果頁需兼顧顧問感與轉單效率
5. 不得假設企業必須具備高成熟資訊系統
6. 保留未來串接 CRM/BI/ERP 的擴充能力
7. 若既有後台不足以支撐，需可獨立新建最小後台
8. Phase 1 以 localStorage + JSON 設定檔為主，預留 GAS API 擴充

## Goals / Non-Goals

**Goals:**
- 提供 IC 通路產業可直接使用的診斷工具入口
- 支援不同數位成熟度企業分級使用
- 建立最小可用管理後台
- 導流至顧問服務

**Non-Goals:**
- 即時 ERP/CRM API 串接
- 複雜 ETL 與資料倉儲
- 大型 BI 分析後台
- 自動 PDF 精美排版
- 客製化資料清洗平台
- 複雜多角色權限矩陣
- 獎酬與 HR 系統連動

## Risks / Trade-offs

| 風險 | 緩解 |
|------|------|
| 題庫品質影響診斷可信度 | 權重與規則設定化，可由顧問迭代調整 |
| 資料上傳格式不一致 | 提供標準模板 + 嚴格欄位驗證 |
| 後台擴充可能與現有 admin 衝突 | 以 Tab 方式隔離，不影響現有功能 |
| localStorage 容量限制 | Phase 1 可接受，Phase 2 遷移至 GAS/API |
