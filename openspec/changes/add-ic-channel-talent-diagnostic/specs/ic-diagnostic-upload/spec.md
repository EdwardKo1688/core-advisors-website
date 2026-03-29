## ADDED Requirements

### Requirement: 檔案上傳支援
系統 SHALL 支援 Excel (.xlsx) 與 CSV (.csv) 檔案上傳。

#### Scenario: 上傳 Excel 檔案
- **WHEN** 使用者選擇一個 .xlsx 檔案並點擊上傳
- **THEN** 系統解析檔案內容，顯示解析結果預覽

#### Scenario: 上傳不支援的格式
- **WHEN** 使用者嘗試上傳 .pdf 檔案
- **THEN** 系統拒絕並提示「僅支援 .xlsx 與 .csv 格式」

### Requirement: 標準模板提供
系統 SHALL 提供可下載的標準資料模板，涵蓋公司基本資料、角色清單、客戶資料、產品線、專案、營收、毛利、費用、forecast、支援活動。

#### Scenario: 下載模板
- **WHEN** 使用者點擊「下載標準模板」
- **THEN** 系統下載對應角色的 Excel 模板檔案

### Requirement: 欄位驗證
系統 SHALL 驗證上傳資料的必填欄位完整性與格式正確性。

#### Scenario: 必填欄位缺失
- **WHEN** 上傳的 Excel 缺少「公司名稱」必填欄位
- **THEN** 系統標示缺失欄位，提示使用者補充或退回問卷模式

#### Scenario: 格式錯誤
- **WHEN** 營收欄位包含非數字內容
- **THEN** 系統標示格式錯誤的儲存格，提示修正

### Requirement: 欄位映射
系統 SHALL 嘗試自動映射上傳資料的欄位名稱至系統標準欄位。

#### Scenario: 自動映射成功
- **WHEN** 上傳資料的欄位名稱與模板一致
- **THEN** 系統自動完成映射，顯示映射結果供確認

#### Scenario: 映射失敗
- **WHEN** 上傳資料包含未知欄位名稱
- **THEN** 系統列出未映射欄位，允許使用者手動指定對應

### Requirement: 資料不足退回
系統 SHALL 允許使用者在資料不完整時退回問卷模式。

#### Scenario: 選擇退回問卷
- **WHEN** 系統判定上傳資料不足以完成分析
- **THEN** 顯示「資料不足」提示，提供「退回問卷模式」按鈕

### Requirement: 漸進式上傳
系統 SHALL 支援漸進式上傳，不要求一次上傳全部資料。

#### Scenario: 分批上傳
- **WHEN** 使用者先上傳營收資料，後續再上傳毛利資料
- **THEN** 系統合併兩次上傳的資料，更新資料完備度
