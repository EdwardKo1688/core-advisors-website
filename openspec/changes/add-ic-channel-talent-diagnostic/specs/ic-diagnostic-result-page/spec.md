## ADDED Requirements

### Requirement: 結果頁排列順序
結果頁 SHALL 依以下順序排列：診斷摘要 → 總分與成熟度 → 雷達圖 → 三大風險 → 三大建議 → 顧問服務 → 資料完備度 → 留資表單 → CTA。

#### Scenario: 完整結果頁呈現
- **WHEN** 使用者提交診斷後進入結果頁
- **THEN** 頁面依序顯示所有區塊，圖表不是主體而是輔助

### Requirement: 五模型雷達圖
結果頁 SHALL 顯示 Chart.js 雷達圖，呈現五模型各維度分數。

#### Scenario: 顯示雷達圖
- **WHEN** 結果頁載入
- **THEN** 雷達圖顯示五個軸（營收、毛利、費效、貢獻、能力與協同），各軸分數以 0-100 標示

### Requirement: 三大風險呈現
結果頁 SHALL 顯示前三大風險，每條風險包含標題、描述與建議回應。

#### Scenario: 顯示風險卡片
- **WHEN** 系統偵測到 3 條以上紅旗
- **THEN** 結果頁顯示嚴重度最高的前 3 條，以警示卡片呈現

#### Scenario: 不足三條風險
- **WHEN** 系統僅偵測到 1 條紅旗
- **THEN** 結果頁顯示 1 條風險卡片，其餘區域顯示「目前無額外重大風險」

### Requirement: 三大改善建議
結果頁 SHALL 根據風險與缺口產出 3 條優先改善建議，含時程標籤。

#### Scenario: 顯示行動建議
- **WHEN** 結果頁載入
- **THEN** 顯示 3 條依優先度排序的建議卡片，每條含建議描述與建議時程

### Requirement: 資料完備度說明
結果頁 SHALL 顯示本次診斷的資料完備度，說明哪些模型有資料支撐、哪些僅靠問卷。

#### Scenario: Mode A 資料完備度
- **WHEN** 使用者僅完成問卷
- **THEN** 資料完備度標示「基礎」，建議上傳資料以提升精度

### Requirement: 留資表單
結果頁 SHALL 包含留資表單，收集公司名稱、姓名、職稱、Email、電話、同意條款。

#### Scenario: 填寫留資表單
- **WHEN** 使用者填寫並提交留資表單
- **THEN** 系統儲存 Lead 資料，關聯至本次診斷 session

### Requirement: 顧問 CTA
結果頁底部 SHALL 包含主 CTA（預約顧問深度診斷）、次 CTA（複製摘要）、次次 CTA（重新診斷）。

#### Scenario: 點擊預約顧問
- **WHEN** 使用者點擊「預約顧問深度診斷」
- **THEN** 導向 booking.html，URL 附帶 ic_scenario、ic_health、ic_risks 參數

#### Scenario: 複製診斷摘要
- **WHEN** 使用者點擊「複製診斷摘要」
- **THEN** 系統使用 Clipboard API 複製格式化摘要文字，顯示 toast 提示「已複製」
