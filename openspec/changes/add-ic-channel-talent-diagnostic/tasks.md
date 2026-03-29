# IC 產業人才轉型診斷與分級分析工具 — 任務清單

## 0. 現況盤點（必做）
- [x] 0.1 檢查現有網站登入入口是否存在 → admin.html 內嵌登入表單，無獨立 login.html
- [x] 0.2 檢查 `/login` 是否可正常使用 → 無 /login 路由，登入整合在 admin.html
- [x] 0.3 檢查現有後台路由與頁面 → admin.html SPA，5 Tab（儀表板/診斷紀錄/預約管理/CMS/設定）
- [x] 0.4 檢查現有管理功能是否包含資料管理能力 → 有 CRUD + CSV 匯出，無檔案上傳
- [x] 0.5 檢查現有前台導覽與新工具整合位置 → Navbar 8 項 + tools.html 工具卡片可直接整合
- [x] 0.6 盤點現有部署是否支持新增後台頁面 → 靜態站可直接新增 HTML，GAS 後端可擴充
- [x] 0.7 產出「可沿用 / 不可沿用 / 需新建」結論 → 登入可沿用、後台需擴充、檔案上傳需新建、CSS 可沿用

## 一、產品規格
- [x] 1.1 確認產品正式名稱 → IC 產業人才轉型診斷與分級分析工具
- [x] 1.2 確認網站主標與副標 → 定義於 design.md 七～九章
- [x] 1.3 確認三角色定義（Sales / PM / FAE） → 定義於 design.md 第七章
- [x] 1.4 確認五模型定義（營收 / 毛利 / 費效 / 貢獻 / 能力與協同） → 定義於 design.md 第八章
- [x] 1.5 確認不同成熟度適用敘述 → Mode A/B/C 三級，定義於 design.md 第四章
- [x] 1.6 確認成熟度等級與分數區間（Level A-D） → A>=85, B:70-84, C:55-69, D:<55
- [x] 1.7 確認 CTA 分流邏輯 → 主CTA 預約顧問 / 次CTA 複製摘要 / 次次CTA 重新診斷

## 二、輸入模式設計
- [x] 2.1 定義問卷模式流程（Mode A） → 角色選擇→基本資料→五模型題組→提交→結果
- [x] 2.2 定義問卷 + 基礎資料上傳模式流程（Mode B） → 同上 + 上傳步驟（Excel/CSV）
- [x] 2.3 定義資料不足退回問卷模式邏輯 → 必填欄位缺失時提示，可退回 Mode A
- [x] 2.4 定義進階整合模式預留欄位（Mode C） → Phase 2+ 預留，不在 MVP 範圍

## 三、題庫與評分邏輯
- [x] 3.1 建立 Sales 題庫（JSON 格式） → ic-diagnostic-data/questions-sales.json (18 題)
- [x] 3.2 建立 PM 題庫（JSON 格式） → ic-diagnostic-data/questions-pm.json (17 題)
- [x] 3.3 建立 FAE 題庫（JSON 格式） → ic-diagnostic-data/questions-fae.json (16 題)
- [x] 3.4 題目對應五模型分類 → 每題含 model + category 欄位
- [x] 3.5 建立模型內子分數計算規則 → scoring-config.json subScoreWeights
- [x] 3.6 建立角色別權重設定（SCORING_CONFIG） → scoring-config.json roleWeights
- [x] 3.7 建立總分計算規則 → 五模型加權加總，權重從 config 讀取
- [x] 3.8 建立成熟度分級規則（Level A-D） → scoring-config.json maturityLevels
- [x] 3.9 定義問卷分數與資料分數整合原則 → basic/advanced/comprehensive 三級

## 四、資料上傳與模板設計
- [x] 4.1 定義標準資料模板清單 → upload-templates.json 含 10 個模板
- [x] 4.2 設計 Excel 上傳模板 → 模板定義含欄位結構，前端生成 .xlsx 下載
- [x] 4.3 設計 CSV 上傳模板 → 同上，支援 .csv 格式
- [x] 4.4 定義必要欄位與選填欄位 → 每模板含 required_fields + optional_fields
- [x] 4.5 設計欄位驗證規則 → validationRules 含 8 種驗證類型
- [x] 4.6 設計資料完備度判斷規則 → completenessThresholds + completeness_weight
- [x] 4.7 設計欄位映射格式 → fieldMappingAliases 含中英文欄位對照
- [x] 4.8 設計上傳失敗提示邏輯 → uploadFailureMessages 含 6 種錯誤訊息模板

## 五、智慧診斷規則
- [x] 5.1 建立高營收低毛利規則 → RULE-01, severity:high
- [x] 5.2 建立高支援低轉換規則 → RULE-02, severity:high
- [x] 5.3 建立 forecast 品質偏弱規則 → RULE-03, severity:high
- [x] 5.4 建立費用投入未形成成果規則 → RULE-04, severity:high
- [x] 5.5 建立角色別建議動作範本 → roleActionTemplates (sales/pm/fae × strength/improvement)
- [x] 5.6 建立三大風險排序規則 → riskSortLogic: severity × priority, topN=3
- [x] 5.7 建立三大建議行動排序規則 → actionSortLogic: P1>P2>P3, topN=5
- [x] 5.8 建立資料不足時的保守判讀規則 → conservativeMode: 4 條退化規則

## 六、前台頁面
- [x] 6.1 建立 ic-diagnostic.html 頁面骨架 → 含 Navbar/Footer/meta, 3 views (intro/diagnostic/result)
- [x] 6.2 建立 ic-diagnostic.css 樣式檔 → McKinsey 風格, ~700 行, 含 RWD (768px/480px)
- [x] 6.3 建立 ic-diagnostic.js 主程式檔 → IIFE 模組 ICD, ~550 行, 狀態管理+計算+渲染
- [x] 6.4 建立工具介紹區塊 → 產品定位、適用對象、診斷內容、產出報告 3 卡片
- [x] 6.5 建立成熟度適用說明區塊 → Level A-D 4 級卡片, 含顏色/分數區間/描述
- [x] 6.6 建立開始診斷入口與角色選擇 UI → 3 角色選擇卡片, 題數顯示
- [x] 6.7 建立多步驟問卷頁 → sidebar 進度 + 按模型分組 + 答題驗證 + 步驟切換
- [x] 6.8 建立資料上傳頁 → 拖拽上傳 + .xlsx/.csv 驗證 + 5MB 限制 + 模板下載連結
- [x] 6.9 建立結果頁 → 分數環 + 雷達圖(Chart.js) + 模型分數卡 + 風險 + 建議
- [x] 6.10 建立資料完備度呈現區塊 → 問卷/上傳雙進度條 + 不足提示
- [x] 6.11 建立留資表單 → 姓名/Email/電話/公司, localStorage 儲存
- [x] 6.12 建立 CTA 區塊 → 預約顧問(主) / 複製摘要(次) / 重新診斷(次次)
- [x] 6.13 實作「複製診斷摘要」功能 → Clipboard API + toast 提示, 含完整摘要格式
- [x] 6.14 實作 CTA 導流至 booking.html → 附帶 ic_scenario/ic_health/ic_risks params

## 七、管理後台
- [x] 7.1 建立管理員登入頁 → 沿用現有 admin.html，登入已存在，session 驗證完整
- [x] 7.2 建立後台首頁 Dashboard → 新增 IC 診斷 4 卡片（診斷數/留資/平均分/高風險）
- [x] 7.3 建立診斷紀錄列表頁 → tab-ic-sessions, 篩選角色/等級/搜尋, 表格顯示
- [x] 7.4 建立診斷詳情 Modal → icSessionModal, 五模型分數 + 風險 + 行動 + 完備度
- [x] 7.5 建立留資名單列表頁 → tab-ic-leads, 搜尋/狀態篩選, localStorage 資料, 狀態更新
- [x] 7.6 建立上傳資料列表頁 → tab-ic-uploads, MVP 版本佔位頁
- [x] 7.7 建立題庫管理頁 → tab-ic-questions, 角色/模型篩選, 動態讀取 JSON, 啟用/停用狀態
- [x] 7.8 建立權重設定頁 → tab-ic-weights, 3 角色卡 × 5 模型, bar chart 視覺化, 子分數權重
- [x] 7.9 建立規則設定頁 → tab-ic-rules, 12 條規則表格, 嚴重度/優先級/觸發數/行動數
- [x] 7.10 建立模板管理頁 → tab-ic-templates, 10 模板列表, 必填/選填欄位顯示
- [x] 7.11 建立結果查看頁 → 整合於 Sessions 詳情 Modal, 顧問可完整閱讀診斷結果
- [x] 7.12 建立後台基本權限保護 → sessionStorage token 驗證, 沿用現有機制
- [x] 7.13 測試登入與登出流程 → 密碼 admin, sessionStorage 保護, 登出清除 token

## 八、資料與服務層
- [x] 8.1 建立題庫設定 JSON 結構 → questions-{role}.json（Phase 3 建立，結構含 id/model/category/weight/options/required）
- [x] 8.2 建立權重設定 JSON 結構 → scoring-config.json（Phase 3 建立，含 roleWeights/subScoreWeights/maturityLevels）
- [x] 8.3 建立規則設定 JSON 格式 → diagnostic-rules.json（Phase 5 建立，含 rules/conservativeMode/roleActionTemplates）
- [x] 8.4 建立模板設定結構 → upload-templates.json（Phase 4 建立，含 10 模板 × required/optional/completeness_weight）
- [x] 8.5 建立資料驗證 service → ic-diagnostic-service.js ICDService.Validator（non_empty/positive_integer/positive_number/percentage/year_range/in_list/email/phone 8 種規則，validateField/validateRow/validateFile/getValidationSummary）
- [x] 8.6 建立資料解析 service → ic-diagnostic-service.js ICDService.Parser（parseCSV/parseExcel/parseFile/applyFieldMapping/detectTemplateType/calculateDataCompleteness，Excel Phase 2 整合 SheetJS）
- [x] 8.7 建立 DataStore 模組 → ic-diagnostic-service.js ICDService.DataStore（saveSession/getSessions/getLastSession/getSessionById/deleteSession，icd_sessions + icd_last_result 雙寫，最多 100 筆）
- [x] 8.8 建立 Lead 儲存結構 → ICDService.DataStore（saveLead/getLeads/updateLeadStatus/deleteLead，含 id/name/email/phone/company/source/role/score/maturity/status/timestamp）
- [x] 8.9 建立 Upload 儲存結構 → ICDService.DataStore（saveUpload/getUploads/updateUploadStatus，含 id/sessionId/fileName/fileSize/fileType/role/templateId/status/rowCount/errorCount/timestamp）
- [x] 8.10 建立分數計算 service → ICDService.Scorer（calculateModelScores/calculateOverallScore/getMaturityLevel/calculateCompleteness/calculateDiagnostic，5 模型 × 4 子分數 weighted 計算）
- [x] 8.11 建立診斷判讀 service → ICDService.RuleEngine（evaluate/evaluateRule/applyConservativeMode，支援 and/or 條件組合，Top 3 severity × priority 排序，完備度 <60% 保守降級）
- [x] 8.12 建立建議生成 service → ICDService.Recommendation（getTopActions/getRoleFeedback/generateSummaryText/computeFullResult，Top 5 P1>P2>P3，整合 Scorer+RuleEngine 一鍵計算）

## 九、網站整合
- [x] 9.1 在 tools.html 新增 IC 產業人才轉型工具卡 → 新增「◆ 產業人才診斷」section，含工具說明/四大特性標籤/開始診斷+預約諮詢 CTA，插入 Blue Sheet AI 後、Category B 前
- [x] 9.2 在 navigator.html 新增 IC 產業入口 → diagnosis-cards 新增第三張卡片（IC 通路人才 badge），含五大 diagnosis-dim 標籤，CTA 連結 ic-diagnostic.html；CTA section 也新增 IC 人才診斷按鈕
- [x] 9.3 在 solutions.html 加入導流連結 → 新增「IC 通路商人才診斷導流」callout block（三大方案比較後），含開始診斷+預約顧問解讀 CTA；底部 CTA 加入 IC 人才轉型診斷按鈕
- [x] 9.4 統一按鈕文字、標題風格與顧問語氣 → 「開始診斷」/「預約顧問諮詢」/「預約顧問解讀」統一顧問語氣；solutions.html 底部「預約顧問諮詢」修正連結至 booking.html（原本錯連 navigator.html）
- [x] 9.5 檢查與現有網站 IA 是否一致 → tools/navigator/solutions 頁尾 footer-col 服務清單均新增「IC 人才診斷」連結；booking.html「IC 人才轉型顧問諮詢」加入諮詢主題下拉選項
- [x] 9.6 修改 booking.html / booking.js 接收 ic_ params 並帶入備註 → booking.js 新增 prefillICDiagnosticSummary()，讀取 source=ic-diagnostic 時解析 ic_scenario/ic_health/ic_risks 帶入備註；自動選取「IC 人才轉型顧問諮詢」主題

## 十、分析與追蹤
- [x] 10.1 建立開始診斷事件追蹤 → ICDAnalytics.trackStart(role)，在 selectRole() 角色載入完成後觸發，event: icd_start
- [x] 10.2 建立問卷完成事件追蹤 → ICDAnalytics.trackQuestionnaireDone(role, answered, required)，在 nextStep() 進入 upload 步驟時觸發，含 completion_rate，event: icd_questionnaire_done
- [x] 10.3 建立資料上傳成功事件追蹤 → ICDAnalytics.trackUploadSuccess(role, fileName, ext, size)，在 processUpload() 驗證通過後觸發，event: icd_upload_success
- [x] 10.4 建立結果頁瀏覽事件追蹤 → ICDAnalytics.trackViewResult(role, score, level, completeness, riskCount)，在 showView('result') 時觸發，event: icd_view_result
- [x] 10.5 建立留資送出事件追蹤 → ICDAnalytics.trackLeadSubmit(role, score, level)，在 submitLead() 成功儲存後觸發，event: icd_lead_submit
- [x] 10.6 建立預約顧問點擊事件追蹤 → ICDAnalytics.trackBookingClick(role, level, source)，在 renderResult() 綁定 ctaBooking click + data-booking-source 通用追蹤，event: icd_booking_click

## 十一、測試
- [ ] 11.1 測試 Sales 完整流程（角色選擇 → 問卷 → 結果）
- [ ] 11.2 測試 PM 完整流程
- [ ] 11.3 測試 FAE 完整流程
- [ ] 11.4 測試純問卷模式（Mode A）
- [ ] 11.5 測試問卷 + 上傳模式（Mode B）
- [ ] 11.6 測試資料不足退回邏輯
- [ ] 11.7 測試分數計算正確性
- [ ] 11.8 測試規則觸發正確性
- [ ] 11.9 測試手機版顯示（RWD 375px）
- [ ] 11.10 測試後台登入保護
- [ ] 11.11 測試資料儲存正確性（localStorage）
- [ ] 11.12 執行 `/verify` 全站驗證

## 十二、Phase 2 預留
- [x] 12.1 題庫版本管理強化設計 → 版本管理結構（changelog + semantic versioning）、CRUD Drawer 表單設計、GAS/GitHub 儲存策略、版本回滾 UI — 規格寫入 specs/ic-diagnostic-admin-phase2/spec.md §2；後台題庫 tab 加上版本徽章 + disabled「新增題目 Phase 2」按鈕
- [x] 12.2 權重版本管理強化設計 → 可編輯權重 UI（含加總即時驗證）、版本快照 / 回滾設計 — 規格 §3；後台權重 tab 加上版本徽章 + disabled「儲存變更 Phase 2」按鈕
- [x] 12.3 規則管理強化設計 → 展開行 + 嚴重度篩選 + 快速編輯 + CRUD Drawer（含 AND/OR 條件建構器） — 規格 §4；後台規則 tab 加上版本徽章 + disabled「新增規則 Phase 2」按鈕
- [x] 12.4 模板管理強化設計 → CRUD Drawer（動態欄位增刪）、完備度權重驗證、停用/預覽 — 規格 §5；後台模板 tab 加上「下載 CSV」按鈕（已可用）+ disabled「新增模板 Phase 2」按鈕；loadICTemplates() 更新為帶操作欄
- [x] 12.5 欄位映射管理設計 → 新增 tab-ic-fieldmapping（tab + nav 項目）；loadICFieldMapping() 從 upload-templates.json 聚合所有欄位，含篩選器（模板/必填選填），Phase 2 別名欄預留；field-aliases.json 結構設計 — 規格 §6
- [x] 12.6 顧問案件列表設計 → 新增 tab-ic-cases Phase 2 stub；案件狀態機（5 狀態）、案件資料結構、漏斗看板設計 — 規格 §7；admin.html + admin.js loadICCases() stub 完成
- [x] 12.7 報告匯出設計 → 新增 tab-ic-export Phase 2 stub；PDF 報告結構（5 頁設計）、Excel 批次匯出、週期統計報告、技術選型（jsPDF + html2canvas / GAS + SheetJS） — 規格 §8；admin.html + admin.js loadICExport() stub 完成
- [x] 12.8 角色權限細分設計 → 新增 tab-ic-permissions Phase 2 stub；四層角色（admin/senior_consultant/consultant/viewer）× 所有功能模組的權限矩陣、filterNavByRole() 實作方案、GAS 密碼分層設計 — 規格 §9；admin.html 靜態矩陣表格完成

## 十三、上線準備
- [x] 13.1 完成內容校稿 → 修正 hero desc 不當 `<br>` 強制換行；footer 版權文字統一為「© 2026 核心顧問有限公司 Core Consultant Ltd. 版權所有」+ 新增返回首頁/預約諮詢連結；確認所有 placeholder 範例文字正確、無 TODO/FIXME；問題清單（0 個剩餘問題）
- [x] 13.2 完成 UI 一致性檢查 → 字型 Noto Sans TC ✅；btn-primary 顏色 rgb(0,51,102) = --navy ✅；navbar 預約諮詢連結 booking.html ✅；Chart.js 4.4.0 載入 ✅；所有 view 無 JS 錯誤 ✅；網路請求 0 failed ✅
- [x] 13.3 完成基本 SEO 設定 → ic-diagnostic.html 新增：`<meta name="description">` 強化版（含「約 15 分鐘」）、`<meta name="robots" content="index, follow">`、`<link rel="canonical">`、og:type / og:title / og:description / og:url / og:site_name / og:locale、Twitter Card (summary)
- [x] 13.4 完成事件追蹤驗證 → 6 個 ICDAnalytics 事件全數驗證：icd_start ✅（role_label）、icd_questionnaire_done ✅（question_count/total_count/completion_rate）、icd_upload_success ✅（file_type/file_size/file_name）、icd_view_result ✅（score/maturity_level/completeness/risk_count）、icd_lead_submit ✅（score/maturity_level）、icd_booking_click ✅（maturity_level/click_source）；全部含 event_category:"ic_diagnostic" + timestamp
- [x] 13.5 完成 MVP 上線 → 上線前置檢查全部通過：3 大模組載入（ICD/ICDService/ICDAnalytics v1.0.0）、所有 script 版本字串 ?v=20260329、SEO meta 完整、Chart.js CDN 可用、9 個 navbar 連結正確、0 個網路請求失敗；靜態檔案部署至 GitHub Pages 即可上線
