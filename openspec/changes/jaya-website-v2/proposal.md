## Why

Jaya 城邦國際（誠邦網絡股份有限公司）現有網站 jaya.com.tw 採用傳統設計風格，內容結構鬆散、視覺層次不足，未能有效傳達企業的專業定位與價值主張。在客服解決方案市場競爭日趨激烈的環境下，網站作為企業門面，需要一次全面升級：

- **品牌形象落差**：現有網站視覺設計與 Jaya 代理的 Genesys Cloud 等世界級產品定位不符
- **內容過載**：頁面資訊密度高但缺乏重點提煉，無法在 10 秒內讓訪客理解核心價值
- **推廣效率低**：缺乏明確的轉換路徑（CTA），無法有效將流量轉化為商機
- **營運管理缺口**：無後台管理能力，內容更新需開發人員介入

## What Changes

**全新獨立網站（麥肯錫風格重塑）：**

- 以「少即是多」為設計原則，重新梳理 Jaya 的價值主張與服務架構
- 5 頁精簡結構取代現有冗長多頁架構
- 純靜態 HTML/CSS/JS 架構，部署於 GitHub Pages，零維運成本
- Google Sheets + Google Apps Script 實現輕量後台管理
- 數據驅動的視覺設計，用數字建立信任感

## Capabilities

### New Capabilities

- `landing-page`: 首頁 — 全螢幕 Hero、三大價值主張、客戶數據亮點、核心產品預覽、CTA 轉換區塊
- `about-services`: 關於與服務 — 企業故事（精煉版）、三大服務線（顧問諮詢/系統整合/運維支持）、合作夥伴與認證
- `solutions-products`: 產品方案 — innoCTI、innoService、innoSales、innoChat、Genesys Cloud 的產品卡片與核心功能展示
- `cases-insights`: 案例與洞見 — 精選客戶案例（數據成果導向）、產業洞見文章、動態載入（Google Sheets）
- `contact-inquiry`: 聯絡與諮詢 — 諮詢表單（Google Forms/GAS）、聯絡資訊、地圖嵌入
- `design-system`: 品牌設計系統 — 深色主題色彩體系、排版規範、共用元件庫（Navbar/Footer/卡片/CTA）

### Modified Capabilities

（無 — 此為全新專案）

## Impact

- **新增專案目錄**：`jaya-website-v2/` 下建立完整靜態網站
- **外部服務依賴**：Google Sheets（內容管理）、Google Apps Script（表單處理）、Google Maps Embed
- **部署**：GitHub Pages 靜態部署，無伺服器維運
- **現有專案無影響**：與顧問網站完全獨立，不共享程式碼
- **SEO**：結構化資料、Open Graph、sitemap.xml
