## ADDED Requirements

### Requirement: 角色選擇
系統 SHALL 提供 Sales、PM、FAE 三個角色選項，使用者 MUST 選擇一個角色後才能進入問卷。

#### Scenario: 選擇 Sales 角色
- **WHEN** 使用者點選 Sales 角色卡片
- **THEN** 系統載入 Sales 專屬題組，進入多步驟問卷第一步

#### Scenario: 未選擇角色即按下一步
- **WHEN** 使用者未選擇角色即點擊「下一步」
- **THEN** 系統顯示「請先選擇角色」驗證提示

### Requirement: 多步驟問卷流程
系統 SHALL 提供多步驟問卷流程，包含：角色選擇 → 基本資料 → 五模型題組 → 資料上傳（可選）→ 提交。

#### Scenario: 完整走完問卷流程
- **WHEN** 使用者選擇角色、填寫基本資料、完成五模型題組並提交
- **THEN** 系統計算分數並導向結果頁

#### Scenario: 中途離開後返回
- **WHEN** 使用者填寫到一半關閉瀏覽器後重新開啟
- **THEN** 系統從 localStorage 恢復上次進度

### Requirement: 題庫動態載入
系統 SHALL 從 JSON 設定檔載入題庫，不得將題目硬編碼在 JavaScript 中。

#### Scenario: 載入 PM 題庫
- **WHEN** 使用者選擇 PM 角色
- **THEN** 系統從題庫設定中篩選 role=PM 的題目，按 model 分組顯示

### Requirement: 輸入模式切換
系統 SHALL 支援 Mode A（純問卷）與 Mode B（問卷 + 資料上傳）兩種模式。

#### Scenario: 選擇 Mode B
- **WHEN** 使用者在問卷流程中選擇「上傳基礎資料」
- **THEN** 系統顯示資料上傳步驟，允許使用者上傳 Excel/CSV

#### Scenario: 資料不足退回問卷
- **WHEN** 使用者上傳的資料不完整（必填欄位缺失）
- **THEN** 系統提示資料不足，可選擇退回純問卷模式完成診斷

### Requirement: 進度條與步驟導航
系統 SHALL 顯示問卷進度條，標示目前步驟與總步驟數。

#### Scenario: 顯示進度
- **WHEN** 使用者進入第 3 步（共 5 步）
- **THEN** 進度條標示 3/5，已完成步驟顯示為已完成狀態
