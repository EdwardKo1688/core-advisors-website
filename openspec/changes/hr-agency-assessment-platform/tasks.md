## 1. 專案初始化與基礎架構

- [x] 1.1 建立 monorepo 專案結構（`apps/web`、`apps/api`、`packages/shared`）
- [x] 1.2 設定 Next.js 14+ App Router 前端專案（TypeScript、Tailwind CSS、ESLint）
- [x] 1.3 設定 Express + TypeScript 後端專案（ts-node、nodemon、環境變數）
- [x] 1.4 設定 Prisma ORM 與 PostgreSQL 連線，建立初始 migration
- [x] 1.5 設定 Docker Compose 開發環境（PostgreSQL、Redis、MinIO）
- [x] 1.6 建立 CI/CD pipeline 基礎（lint、type-check、test、build）
- [x] 1.7 設定共用套件（`packages/shared`）：型別定義、常數、工具函式

## 2. 認證與角色權限系統（rbac-multitenancy）

- [x] 2.1 設計多租戶資料庫 Schema（tenant、user、role、permission 資料模型）
- [x] 2.2 實作 JWT 認證 API（登入、登出、Token 刷新、密碼重設）
- [x] 2.3 實作 RBAC 中介層（7 種角色預設權限矩陣、功能級/資料級權限檢查）
- [x] 2.4 實作多租戶資料隔離（Prisma middleware / RLS policy）
- [x] 2.5 實作總部-分公司層級架構（組織樹、分公司篩選器）
- [x] 2.6 建立帳號管理 API（CRUD、停用/啟用、批次匯入）
- [x] 2.7 建立前端登入頁面與認證 Context/Provider
- [x] 2.8 建立前端帳號管理介面（帳號列表、新增/編輯、角色權限設定）
- [x] 2.9 實作稽核日誌記錄（所有關鍵操作自動記錄）

## 3. 案件全生命週期管理（case-lifecycle）

- [x] 3.1 設計案件資料模型（Case、CaseStage、CaseEvent、Employer、Worker）
- [x] 3.2 實作雇主管理 API（CRUD、批次匯入/匯出 Excel、搜尋篩選）
- [x] 3.3 實作移工管理 API（CRUD、國籍/狀態篩選、聘僱期間追蹤）
- [x] 3.4 實作案件管理 API（建立、階段推進、狀態更新、指派負責人）
- [x] 3.5 實作案件時間軸 API（彙整所有事件、訪視、文件、異常至統一時間軸）
- [x] 3.6 實作案件階段自動提醒（停滯提醒、到期提醒、續聘/離境提醒）
- [x] 3.7 實作案件交接機制 API（交接指派、交接摘要產生、交接確認）
- [x] 3.8 建立前端雇主管理頁面（列表、搜尋、新增/編輯、批次匯入）
- [x] 3.9 建立前端移工管理頁面（列表、篩選、新增/編輯、狀態標記）
- [x] 3.10 建立前端案件管理頁面（列表、時間軸檢視、階段推進操作）
- [x] 3.11 建立前端案件交接流程介面

## 4. 電子卷宗與契約治理（document-vault）

- [x] 4.1 設計文件資料模型（Document、DocumentVersion、DocumentAccess）
- [x] 4.2 設定 MinIO/S3 物件儲存與 presigned URL 上傳機制
- [x] 4.3 實作文件上傳/下載 API（自動分類、metadata 記錄、版本管理）
- [x] 4.4 實作卷宗完整度計算引擎（Completeness Score、缺件偵測）
- [x] 4.5 實作文件存取控制與稽核日誌
- [x] 4.6 實作契約版本管理與到期提醒
- [x] 4.7 建立前端電子卷宗介面（案件卷宗檢視、文件上傳、完整度儀表板）
- [x] 4.8 建立前端契約管理介面（版本歷程、到期提醒設定）

## 5. 訪視服務運營引擎（visit-operations）

- [x] 5.1 設計訪視資料模型（Visit、VisitTemplate、VisitItem、VisitResult、VisitSignature）
- [x] 5.2 實作訪視資料維護 API（多語常用內容、服務項目、服務結果 CRUD）
- [x] 5.3 實作訪視表 CRUD API（建立、填寫、暫存、送審）
- [x] 5.4 實作訪視審核流程 API（主管審核、批次審核、退回修改、電子簽章）
- [x] 5.5 實作訪視派工 API（主管派工、負責人通知、行事曆整合）
- [x] 5.6 實作服務日曆 API（天/週/月檢視、狀態篩選、排程調整）
- [x] 5.7 實作例行服務自動排程（週期偵測、待派工清單產生）
- [x] 5.8 實作訪視追蹤機制（後續追蹤訪視表自動建立與關聯）
- [x] 5.9 實作訪視表 PDF 匯出（單筆/批次、含簽名與附件照片）
- [x] 5.10 建立前端訪視管理頁面（列表、篩選、審核、派工）
- [x] 5.11 建立前端服務日曆頁面（視覺化行事曆、拖拽排程）
- [x] 5.12 建立前端訪視表填寫介面（多語切換、服務項目勾選、經過描述）

## 6. 法遵風控引擎（compliance-engine）

- [x] 6.1 設計法遵資料模型（FeeRule、Regulation、Violation、ComplianceCheck）
- [x] 6.2 實作收費規則引擎 API（國籍/工種收費上限設定、即時檢核、退費計算）
- [x] 6.3 實作法規知識庫 API（法條 CRUD、全文搜尋、版本管理）
- [x] 6.4 實作流程風險提示 API（關鍵節點 checklist、合規性即時檢核）
- [x] 6.5 實作違規處分紀錄管理 API（CRUD、改善追蹤、評鑑扣分連動）
- [x] 6.6 建立前端法遵管理介面（收費規則設定、法規知識庫瀏覽、違規紀錄）
- [x] 6.7 建立前端流程風險提示元件（嵌入案件操作流程中的即時提醒）

## 7. 異常事件管理（incident-management）

- [x] 7.1 設計異常事件資料模型（Incident、IncidentAction、ResourceDirectory、CaseStudy）
- [x] 7.2 實作異常事件 CRUD API（建立、自動分級、狀態更新）
- [x] 7.3 實作 SLA 管控引擎（時限追蹤、超時自動升級、通知觸發）
- [x] 7.4 實作資源名冊管理 API（外部資源 CRUD、地區/事件類型分類）
- [x] 7.5 實作通報草稿產生 API（模板管理、自動填入事件資訊）
- [x] 7.6 實作案例知識庫 API（結案歸檔、分類搜尋）
- [x] 7.7 建立前端異常事件管理頁面（工單列表、詳情、狀態時間軸）
- [x] 7.8 建立前端資源名冊與案例知識庫介面

## 8. 滿意度調查與分析（satisfaction-survey）

- [x] 8.1 設計滿意度資料模型（Survey、SurveyQuestion、SurveyResponse、SurveyAnalysis）
- [x] 8.2 實作多語問卷建置 API（問卷模板 CRUD、多語翻譯管理）
- [x] 8.3 實作問卷發送與回收 API（自動排程發送、SMS/QR Code 連結、回收追蹤）
- [x] 8.4 實作滿意度分析 API（統計計算、與續約/客訴交叉分析、改善閉環追蹤）
- [x] 8.5 建立前端問卷管理介面（建置、發送、回收率追蹤）
- [x] 8.6 建立前端移工/雇主問卷填寫頁面（多語自適應、行動端優化）
- [x] 8.7 建立前端滿意度分析報表頁面（圖表、交叉分析、流失預警）

## 9. 教育訓練與知識傳承（training-knowledge）

- [x] 9.1 設計訓練資料模型（TrainingPlan、TrainingCourse、Attendance、KnowledgeArticle）
- [x] 9.2 實作訓練計畫管理 API（年度計畫 CRUD、課程排程、完成率追蹤）
- [x] 9.3 實作訓練出勤紀錄 API（簽到/簽退、時數累計、評鑑佐證彙整）
- [x] 9.4 實作新人交接清單 API（角色化清單模板、進度追蹤、導師指派）
- [x] 9.5 實作知識庫管理 API（文件 CRUD、分類標籤、全文搜尋）
- [x] 9.6 建立前端訓練管理介面（計畫、課程、出勤、完成率儀表板）
- [x] 9.7 建立前端知識庫介面（瀏覽、搜尋、上傳）

## 10. 評鑑管理中台（assessment-engine）

- [x] 10.1 設計評鑑資料模型（AssessmentTemplate、Indicator、Evidence、Prediction）
- [x] 10.2 實作評鑑指標模板管理 API（附表一/二/三、版本化、年度差異比較）
- [x] 10.3 實作評鑑完成度追蹤引擎（自動偵測缺件、Completeness Score 計算）
- [x] 10.4 實作佐證清單自動產生 API（跨模組資料關聯、抽查包整理、PDF/ZIP 匯出）
- [x] 10.5 實作評鑑加扣分規則引擎（加分/扣分項目設定、違規處分連動計算）
- [x] 10.6 實作評鑑落點預測引擎（基於完成度與歷史資料的等級預測）
- [x] 10.7 建立前端評鑑管理頁面（指標模板管理、完成度儀表板、佐證清單）
- [x] 10.8 建立前端評鑑落點預測頁面（預測結果、關鍵缺口、改善建議）

## 11. AI Copilot 模組群（ai-copilots）

- [x] 11.1 設計 AI 基礎架構（AI Gateway、prompt 管理、token 用量追蹤、streaming 回應）
- [x] 11.2 整合 Claude API（SDK 設定、API Key 管理、模型選擇策略）
- [x] 11.3 建立 RAG Pipeline（pgvector 向量索引、法規/知識庫 Embedding、檢索引擎）
- [x] 11.4 實作評鑑 Copilot（缺口分析 prompt、抽查包整理 prompt）
- [x] 11.5 實作法遵風控 Copilot（法規問答 RAG、操作合規性檢核 prompt）
- [x] 11.6 實作案件摘要與交接助手（案件摘要 prompt、交接文件 prompt）
- [x] 11.7 實作異常事件助手（事件分類 prompt、SOP 推薦、通報草稿 prompt）
- [x] 11.8 實作滿意度與續約分析 Copilot（情緒分析 prompt、流失預測 prompt）
- [x] 11.9 實作經營決策 Copilot（週報產生 prompt、風險排名 prompt）
- [x] 11.10 建立前端 AI Copilot 側邊欄對話介面（頁面上下文感知、streaming 顯示）
- [x] 11.11 建立前端各 Copilot 專屬觸發按鈕與結果呈現介面

## 12. 經營決策儀表板（executive-dashboard）

- [x] 12.1 設計儀表板資料彙整 API（跨模組 KPI 計算、快取策略）
- [x] 12.2 實作經營總覽 API（核心 KPI 卡片、趨勢資料）
- [x] 12.3 實作分公司績效比較 API（多維度排名、異常值偵測）
- [x] 12.4 實作風險熱點 API（跨模組風險因子彙整、分類排名）
- [x] 12.5 實作自動週報/月報產生與 Email 發送
- [x] 12.6 建立前端經營總覽儀表板（KPI 卡片、趨勢圖表、互動式篩選）
- [x] 12.7 建立前端分公司績效比較頁面（表格、圖表、排名）
- [x] 12.8 建立前端風險熱點頁面（分類標籤、風險排名、鑽取詳情）

## 13. PWA 行動應用（pwa-mobile）

- [x] 13.1 設定 PWA 基礎配置（manifest.json、Service Worker、離線快取策略）
- [x] 13.2 實作行動端響應式佈局（導航、頁面切換、觸控優化）
- [x] 13.3 實作離線訪視表填寫功能（IndexedDB 本地儲存、離線表單）
- [x] 13.4 實作離線資料同步機制（背景同步、衝突偵測、手動解決介面）
- [x] 13.5 實作行動端電子簽名元件（Canvas 觸控簽名板、簽名圖檔產生）
- [x] 13.6 實作行動端相機拍照功能（照片壓縮、GPS 座標/時間戳嵌入）
- [x] 13.7 實作行動端訪視提醒與待辦首頁
- [x] 13.8 實作行動端訪視追蹤清單

## 14. 通知系統與外部整合

- [x] 14.1 設計通知資料模型（Notification、NotificationTemplate、NotificationLog）
- [x] 14.2 實作通知引擎（站內通知、Email、SMS 多管道發送）
- [x] 14.3 整合 Email 服務（SendGrid / AWS SES）
- [x] 14.4 整合 Google Calendar API（訪視排程同步）
- [x] 14.5 建立前端通知中心（站內通知列表、已讀/未讀、設定偏好）

## 15. 測試與部署

- [x] 15.1 撰寫核心模組單元測試（認證、RBAC、案件管理、訪視審核）
- [x] 15.2 撰寫 API 整合測試（關鍵流程端到端測試）
- [x] 15.3 撰寫前端元件測試（關鍵頁面、表單驗證、互動流程）
- [x] 15.4 設定 Docker 生產環境映像檔（多階段建置、環境變數管理）
- [x] 15.5 設定雲端部署架構（AWS ECS/GCP Cloud Run、RDS/Cloud SQL、S3）
- [x] 15.6 設定 CI/CD 自動部署流程（GitHub Actions → 測試 → 建置 → 部署）
- [x] 15.7 設定監控與告警（應用程式健康檢查、錯誤追蹤、效能監控）
- [x] 15.8 撰寫部署文件與系統操作手冊
