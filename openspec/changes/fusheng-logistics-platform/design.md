## Context

富昇智慧物流目前有一個內部「營運推動協作中心」單頁應用（pure HTML/CSS/JS），用於戰略規劃與內部溝通。現在需要建立一個獨立的對外推廣平台網站，整合三大面向：品牌推廣、客戶自助服務、營運管理後台。

現有技術環境：
- 顧問網站使用 HTML/CSS/JS + Google Sheets 後端
- 內部協作中心為單一 HTML 檔案，含 sidebar 導航 + SPA 頁面切換
- 團隊熟悉 Noto Sans TC 字型、CSS 變數體系

## Goals / Non-Goals

**Goals:**
- 建立專業的對外品牌推廣網站，展示富昇智慧物流的四大運能服務
- 提供貨主與車隊的自助服務入口（詢價、下單、追蹤、接單）
- 建立營運後台管理系統（訂單、車隊、KPI、客戶）
- RWD 響應式設計，支援桌面、平板、手機
- 可獨立部署，不依賴現有顧問網站

**Non-Goals:**
- 不建立即時支付系統（初期以詢價+人工確認為主）
- 不開發原生 App（先以 RWD 網頁為主）
- 不建立即時 GPS 車輛追蹤（初期以狀態更新為主）
- 不整合 ERP/TMS 系統（Phase 2 再處理）

## Decisions

### 1. 網站架構：多頁面靜態網站 + SPA 後台

**選擇**：推廣頁面使用獨立 HTML 頁面，後台管理使用 SPA 模式
**理由**：推廣頁面需要 SEO 可見性，獨立頁面有利於搜尋引擎索引；後台管理是登入後使用，SPA 提供更流暢的操作體驗。
**替代方案**：全 SPA 會犧牲 SEO；全多頁面會讓後台操作體驗不佳。

### 2. 目錄結構：獨立專案目錄

**選擇**：在 `fusheng-platform/` 目錄下建立獨立網站
```
fusheng-platform/
├── index.html          # 品牌首頁
├── services.html       # 服務總覽
├── service-s90.html    # S90 小件配送
├── service-truck.html  # 中大型配送
├── service-special.html # 專車棧板
├── service-3pl.html    # 第三地出貨
├── cases.html          # 客戶案例
├── shipper.html        # 貨主入口 (SPA)
├── fleet.html          # 車隊入口 (SPA)
├── admin.html          # 營運後台 (SPA)
├── inquiry.html        # 詢價頁面
├── css/
│   ├── style.css       # 全站共用樣式
│   ├── admin.css       # 後台樣式
│   └── portal.css      # 入口頁樣式
├── js/
│   ├── main.js         # 共用功能
│   ├── inquiry.js      # 詢價邏輯
│   ├── shipper.js      # 貨主入口
│   ├── fleet.js        # 車隊入口
│   └── admin.js        # 後台管理
└── assets/
    └── images/
```
**理由**：完全獨立不影響顧問網站，未來可獨立部署。

### 3. 設計風格：深藍科技風格

**選擇**：以 `#0f172a`（深藍）為主色、`#3b82f6`（科技藍）為強調色、`#10b981`（綠色）為成功色
**理由**：延續內部協作中心的設計語言，保持品牌一致性；深藍色調傳達專業與科技感。

### 4. 後端方案：Google Sheets + Google Apps Script

**選擇**：初期使用 Google Sheets 作為資料儲存，Google Apps Script 作為 API
**理由**：與現有顧問網站技術架構一致，團隊已有經驗，零伺服器成本。
**替代方案**：Firebase（較複雜但更強大）、Supabase（需學習新技術）。

### 5. 入口權限：基於角色的簡易認證

**選擇**：貨主/車隊/管理員三種角色，初期使用密碼 + API 驗證
**理由**：與顧問網站後台相同方式，簡單可靠。後續可升級至 SSO。

## Risks / Trade-offs

- **[效能] 靜態頁面無伺服器渲染** → 使用 CSS 動畫與漸進式載入優化首屏體驗
- **[擴展性] Google Sheets 容量有限** → 初期足夠，Phase 2 可遷移至 Firebase/Supabase
- **[安全] 前端密碼驗證不夠安全** → 初期為展示模式，正式上線前升級認證機制
- **[SEO] 純靜態 HTML 的 SEO 能力有限** → 做好 meta tags、Open Graph、結構化資料
- **[維護] 多頁面手動維護 Navbar 一致性** → 使用 JS 動態載入共用 Navbar 組件
