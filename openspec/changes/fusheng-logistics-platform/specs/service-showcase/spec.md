## ADDED Requirements

### Requirement: 服務總覽頁面
services.html SHALL 提供四大運能服務的總覽頁面，以視覺化方式呈現服務矩陣，並引導用戶進入各服務詳細頁。

#### Scenario: 總覽頁面載入
- **WHEN** 用戶訪問 services.html
- **THEN** 頁面顯示服務矩陣，含四大服務類別的卡片，每張卡片含圖示、名稱、適用場景、價格區間提示

### Requirement: S90 小件配送服務頁
service-s90.html SHALL 詳細介紹 S90 小件配送服務，包含服務流程、適用場景、服務範圍、配送時效、費用說明。

#### Scenario: S90 服務頁載入
- **WHEN** 用戶訪問 service-s90.html
- **THEN** 頁面展示 S90 配送的完整服務說明，含適用貨件（電商小件、即時配送）、機車配送流程圖、覆蓋區域、時效承諾

#### Scenario: 從服務頁發起詢價
- **WHEN** 用戶在 S90 服務頁點擊「立即詢價」按鈕
- **THEN** 導航至 inquiry.html 並預選 S90 服務類型

### Requirement: 中大型配送服務頁
service-truck.html SHALL 詳細介紹 1.9 噸與 3.5 噸配送服務，包含車型規格、載重限制、適用場景、配送區域。

#### Scenario: 中大型配送服務頁載入
- **WHEN** 用戶訪問 service-truck.html
- **THEN** 頁面展示 1.9 噸/3.5 噸配送服務，含車型對比表、載重規格、適用場景（商家出貨、區域配送、補貨）

### Requirement: 專車棧板服務頁
service-special.html SHALL 詳細介紹專車與棧板配送服務，包含服務模式、合作車隊、大型貨件處理能力。

#### Scenario: 專車棧板服務頁載入
- **WHEN** 用戶訪問 service-special.html
- **THEN** 頁面展示專車與棧板服務說明，含服務特色（客製化路線、高載重、倉到店）、合作車隊介紹

### Requirement: 第三地出貨服務頁
service-3pl.html SHALL 詳細介紹第三地出貨服務，說明如何整合商家出貨需求，提供一站式物流解決方案。

#### Scenario: 第三地出貨服務頁載入
- **WHEN** 用戶訪問 service-3pl.html
- **THEN** 頁面展示第三地出貨服務，含服務流程圖（商家下單→系統接單→配送→簽收）、95% 地址覆蓋率數據、MOMO 合作案例

### Requirement: 客戶案例頁面
cases.html SHALL 展示完整的客戶成功案例列表，含篩選功能與詳細案例內容。

#### Scenario: 案例列表顯示
- **WHEN** 用戶訪問 cases.html
- **THEN** 頁面顯示客戶案例卡片列表，可依產業類別或服務類型篩選

#### Scenario: 案例詳情展開
- **WHEN** 用戶點擊某個案例卡片
- **THEN** 展開或跳轉顯示完整案例內容，含客戶背景、挑戰、解決方案、成效數據
