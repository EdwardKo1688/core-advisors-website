## ADDED Requirements

### Requirement: 管理員登入保護
後台所有管理頁面 SHALL 受登入保護，未登入使用者不得訪問。

#### Scenario: 未登入訪問後台
- **WHEN** 未登入使用者嘗試訪問後台管理區
- **THEN** 系統導向登入頁面

#### Scenario: 登入成功
- **WHEN** 管理員輸入正確密碼
- **THEN** 系統建立 session，導向後台 Dashboard

### Requirement: IC 診斷 Dashboard
後台 Dashboard SHALL 顯示 IC 診斷數量摘要、留資數量、上傳成功率、近期活動、待處理案件。

#### Scenario: Dashboard 載入
- **WHEN** 管理員進入 IC 診斷 Dashboard
- **THEN** 顯示總診斷數、本月診斷數、留資數、上傳成功率等統計卡片

### Requirement: 診斷紀錄管理
後台 SHALL 提供 IC 診斷紀錄列表，支援依角色、日期、公司篩選。

#### Scenario: 篩選 Sales 診斷
- **WHEN** 管理員選擇角色篩選為 Sales
- **THEN** 列表僅顯示 Sales 角色的診斷紀錄

#### Scenario: 查看診斷詳情
- **WHEN** 管理員點擊某筆紀錄的「詳情」
- **THEN** 顯示完整分數、成熟度、風險、建議

### Requirement: 留資名單管理
後台 SHALL 提供留資名單列表，包含聯絡資料、來源追蹤、狀態標記。

#### Scenario: 更新留資狀態
- **WHEN** 管理員將某筆留資狀態從「新提交」改為「已聯繫」
- **THEN** 系統儲存狀態變更，列表即時更新

### Requirement: 上傳檔案管理
後台 SHALL 提供上傳資料紀錄列表，包含格式驗證結果、欄位映射結果、解析狀態。

#### Scenario: 查看上傳紀錄
- **WHEN** 管理員進入上傳管理頁
- **THEN** 顯示所有上傳紀錄，包含檔案名稱、上傳時間、驗證狀態

### Requirement: 題庫管理
後台 SHALL 提供題庫管理功能，支援依角色與模型分類、啟用/停用題目。

#### Scenario: 新增題目
- **WHEN** 管理員新增一題 PM 毛利模型的題目
- **THEN** 題庫列表新增該題，前台 PM 問卷中可見

#### Scenario: 停用題目
- **WHEN** 管理員停用某題
- **THEN** 該題不再出現於前台問卷中

### Requirement: 權重設定管理
後台 SHALL 提供角色別五模型權重設定，支援版本管理。

#### Scenario: 修改權重
- **WHEN** 管理員修改 FAE 的貢獻模型權重從 40% 改為 35%
- **THEN** 系統儲存新權重版本，後續診斷使用新權重

### Requirement: 規則設定管理
後台 SHALL 提供診斷規則列表管理，支援嚴重度設定、訊息與建議編輯。

#### Scenario: 編輯規則訊息
- **WHEN** 管理員修改「高營收低毛利」規則的建議文字
- **THEN** 後續觸發該規則時使用新建議文字

### Requirement: 模板管理
後台 SHALL 提供上傳模板管理，支援設定必填/選填欄位、模板版本。

#### Scenario: 新增模板版本
- **WHEN** 管理員上傳新版本的營收模板
- **THEN** 前台下載模板時使用最新版本

### Requirement: 結果查看
後台 SHALL 提供結果查看功能，供顧問在接手前檢視診斷結果。

#### Scenario: 顧問檢視結果
- **WHEN** 管理員點擊某筆診斷的「查看結果」
- **THEN** 顯示與前台結果頁相同的內容，含分數、風險、建議
