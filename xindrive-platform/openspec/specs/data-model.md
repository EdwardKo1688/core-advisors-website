# 芯智驅 XinDrive AI — 資料模型規格 v2.0

> CHANGE-001 Platform Redesign 更新
> 資料模型結構保持不變，新增 Demo Story 資料規格

## 1. ER 概覽

```
organizations ─┬─ users ──── user_roles
               │
               ├─ courses ── course_modules ── module_lessons
               │             └── enrollments ── lesson_progress
               │
               ├─ coaching_plans ── coaching_sessions
               │                    └── skill_assessments
               │
               ├─ customers ── contacts
               │  └── opportunities ── opportunity_activities
               │
               └─ targets
```

## 2. 核心資料表

### 2.1 organizations（組織）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | 組織 ID |
| name | varchar(200) | 組織名稱 |
| slug | varchar(100) UNIQUE | URL-friendly 識別碼 |
| plan | varchar(20) | 方案 (free/pro/enterprise) |
| settings | jsonb | 組織設定 |
| created_at | timestamptz | 建立時間 |

### 2.2 users（用戶）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | 用戶 ID |
| org_id | uuid FK → organizations | 所屬組織 |
| email | varchar(255) UNIQUE | 電子郵件 |
| full_name | varchar(100) | 姓名 |
| avatar_url | text | 頭像 URL |
| department | varchar(100) | 部門 |
| title | varchar(100) | 職稱 |
| phone | varchar(30) | 電話 |
| status | varchar(20) | active/inactive/suspended |
| metadata | jsonb | 擴展欄位 |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

### 2.3 roles（角色定義）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | 角色 ID |
| name | varchar(50) UNIQUE | 角色名 (admin/manager/trainer/sales) |
| display_name | varchar(100) | 顯示名稱 |
| permissions | jsonb | 權限定義 |

### 2.4 user_roles（用戶角色關聯）

| 欄位 | 型別 | 說明 |
|------|------|------|
| user_id | uuid FK → users | 用戶 |
| role_id | uuid FK → roles | 角色 |
| org_id | uuid FK → organizations | 組織 |
| PK | (user_id, role_id, org_id) | 複合主鍵 |

---

## 3. 驅・知 LEARN 資料表

### 3.1 courses（課程）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | 課程 ID |
| org_id | uuid FK → organizations | 所屬組織 |
| title | varchar(200) | 課程名稱 |
| description | text | 課程說明 |
| category | varchar(50) | 分類 (sales/procurement/supply_chain/management) |
| difficulty | varchar(20) | 難度 (beginner/intermediate/advanced) |
| thumbnail_url | text | 封面圖 |
| duration_hours | numeric(5,1) | 預估時數 |
| instructor_id | uuid FK → users | 講師 |
| status | varchar(20) | draft/published/archived |
| tags | text[] | 標籤 |
| metadata | jsonb | 擴展資料 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 3.2 course_modules（課程模組）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| course_id | uuid FK → courses | 所屬課程 |
| title | varchar(200) | 模組名稱 |
| description | text | 模組說明 |
| sort_order | integer | 排序 |
| created_at | timestamptz | |

### 3.3 module_lessons（課程內容）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| module_id | uuid FK → course_modules | 所屬模組 |
| title | varchar(200) | 課堂名稱 |
| content_type | varchar(30) | 類型 (video/text/quiz/exercise/download) |
| content | jsonb | 內容資料 |
| duration_minutes | integer | 預估分鐘 |
| sort_order | integer | 排序 |
| created_at | timestamptz | |

### 3.4 enrollments（選課記錄）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| user_id | uuid FK → users | 學員 |
| course_id | uuid FK → courses | 課程 |
| status | varchar(20) | enrolled/in_progress/completed/dropped |
| enrolled_at | timestamptz | 選課時間 |
| completed_at | timestamptz | 完成時間 |
| score | numeric(5,2) | 總分 |

### 3.5 lesson_progress（學習進度）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| enrollment_id | uuid FK → enrollments | 選課記錄 |
| lesson_id | uuid FK → module_lessons | 課堂 |
| status | varchar(20) | not_started/in_progress/completed |
| score | numeric(5,2) | 得分 |
| time_spent_sec | integer | 花費秒數 |
| completed_at | timestamptz | |
| updated_at | timestamptz | |

---

## 4. 驅・伴 COACH 資料表

### 4.1 coaching_plans（陪跑計畫）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| org_id | uuid FK | 組織 |
| coachee_id | uuid FK → users | 被教練者 |
| coach_id | uuid FK → users | 教練 |
| title | varchar(200) | 計畫名稱 |
| methodology | varchar(50) | 方法論 (GROW/MEDDIC/SPIN/CHALLENGER) |
| goals | jsonb | 目標設定 |
| status | varchar(20) | active/completed/paused |
| start_date | date | 開始日期 |
| end_date | date | 結束日期 |
| created_at | timestamptz | |

### 4.2 coaching_sessions（教練 Session）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| plan_id | uuid FK → coaching_plans | 所屬計畫 |
| session_type | varchar(30) | 類型 (1on1/roleplay/review/assessment) |
| title | varchar(200) | Session 主題 |
| notes | text | 記錄筆記 |
| action_items | jsonb | 行動項目 [{text, done}] |
| feedback | jsonb | 回饋 {strengths, improvements, rating} |
| scheduled_at | timestamptz | 預定時間 |
| completed_at | timestamptz | 完成時間 |
| duration_minutes | integer | 時長 |
| status | varchar(20) | scheduled/completed/cancelled |
| created_at | timestamptz | |

### 4.3 skill_assessments（能力評估）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| user_id | uuid FK → users | 受評者 |
| assessor_id | uuid FK → users | 評估者 |
| plan_id | uuid FK → coaching_plans | 關聯計畫 |
| skills | jsonb | 技能評分 [{skill, score, notes}] |
| overall_score | numeric(3,1) | 總分 (1-10) |
| recommendations | text | 建議 |
| assessed_at | timestamptz | 評估時間 |

---

## 5. 驅・效 BOOST 資料表

### 5.1 customers（客戶）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| org_id | uuid FK | 組織 |
| name | varchar(200) | 客戶名稱 |
| industry | varchar(100) | 產業 |
| segment | varchar(50) | 分級 (tier1/tier2/tier3) |
| region | varchar(100) | 地區 |
| annual_revenue | numeric(15,2) | 年營收 |
| employee_count | integer | 員工數 |
| website | text | 網站 |
| notes | text | 備註 |
| owner_id | uuid FK → users | 負責人 |
| status | varchar(20) | prospect/active/inactive/churned |
| tags | text[] | 標籤 |
| metadata | jsonb | 擴展 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 5.2 contacts（聯絡人）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| customer_id | uuid FK → customers | 所屬客戶 |
| full_name | varchar(100) | 姓名 |
| title | varchar(100) | 職稱 |
| email | varchar(255) | 電子郵件 |
| phone | varchar(30) | 電話 |
| line_id | varchar(50) | LINE ID |
| role_in_deal | varchar(50) | 角色 (champion/influencer/decision_maker/blocker) |
| notes | text | 備註 |
| created_at | timestamptz | |

### 5.3 opportunities（商機）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| org_id | uuid FK | 組織 |
| customer_id | uuid FK → customers | 客戶 |
| title | varchar(200) | 商機名稱 |
| type | varchar(50) | 類型 (design_in/spot_buy/contract/project) |
| stage | varchar(30) | 階段 (lead/qualified/proposal/negotiation/closed_won/closed_lost) |
| amount | numeric(15,2) | 預估金額 |
| probability | integer | 成交機率 % |
| expected_close | date | 預計成交日 |
| product_lines | text[] | 產品線 |
| owner_id | uuid FK → users | 負責業務 |
| champion_id | uuid FK → contacts | Champion |
| meddic_score | jsonb | MEDDIC 評估 |
| notes | text | 備註 |
| status | varchar(20) | open/won/lost |
| won_amount | numeric(15,2) | 實際成交金額 |
| closed_at | timestamptz | 結案時間 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 5.4 opportunity_activities（商機活動）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| opportunity_id | uuid FK → opportunities | 商機 |
| user_id | uuid FK → users | 執行人 |
| type | varchar(30) | 類型 (call/visit/email/meeting/demo/quote) |
| title | varchar(200) | 摘要 |
| description | text | 詳細內容 |
| outcome | text | 結果 |
| next_action | text | 下一步行動 |
| activity_date | timestamptz | 活動時間 |
| created_at | timestamptz | |

### 5.5 targets（業績目標）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| org_id | uuid FK | 組織 |
| user_id | uuid FK → users | 目標人 |
| period | varchar(10) | 期間 (2026-Q1, 2026-03) |
| type | varchar(30) | 類型 (revenue/design_in/new_customer/margin) |
| target_value | numeric(15,2) | 目標值 |
| actual_value | numeric(15,2) | 實際值 |
| unit | varchar(20) | 單位 (USD/TWD/count/percent) |
| status | varchar(20) | on_track/at_risk/behind/exceeded |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 6. 系統共用資料表

### 6.1 notifications（通知）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| user_id | uuid FK → users | 接收者 |
| type | varchar(50) | 通知類型 |
| title | varchar(200) | 標題 |
| message | text | 內容 |
| link | text | 連結 |
| read | boolean | 已讀 |
| created_at | timestamptz | |

### 6.2 activity_log（操作日誌）

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid PK | |
| user_id | uuid FK → users | 操作者 |
| action | varchar(50) | 動作 (create/update/delete/login/export) |
| entity_type | varchar(50) | 物件類型 |
| entity_id | uuid | 物件 ID |
| details | jsonb | 詳細資料 |
| created_at | timestamptz | |

---

## 7. 索引策略

- 所有 FK 欄位建立索引
- `users.email` UNIQUE 索引
- `opportunities`: (org_id, status, stage) 複合索引
- `customers`: (org_id, status) 複合索引
- `enrollments`: (user_id, course_id) UNIQUE 索引
- `targets`: (user_id, period, type) UNIQUE 索引
- `activity_log`: (created_at DESC) 索引

---

## 8. Demo Story 資料規格

### 8.1 芯達科技（SinDa Technology）

```javascript
// demo-story.js 需產生以下資料

organization: {
  name: '芯達科技股份有限公司',
  slug: 'sinda-tech',
  plan: 'pro'
}

users: [
  { name: '林志明', role: 'manager', dept: '業務部', title: '業務總監' },
  { name: '陳柏翰', role: 'sales', dept: '業務部', title: '業務專員' },
  { name: '張淑芬', role: 'trainer', dept: '培訓部', title: '資深教練' },
  { name: '管理員', role: 'admin', dept: 'IT', title: '系統管理員' },
  // 加上 6-8 個背景角色（其他業務、採購等）
]
```

### 8.2 Demo 課程（4 門）

| 課程 | 分類 | 難度 | 時數 | 模組數 |
|------|------|------|------|--------|
| MEDDIC 實戰銷售方法論 | sales | advanced | 12h | 6 |
| IC 通路業務基礎 | sales | beginner | 8h | 4 |
| 供應鏈管理入門 | supply_chain | beginner | 6h | 3 |
| 客戶關係經營實務 | management | intermediate | 10h | 5 |

- 陳柏翰正在學「MEDDIC」（進度 45%）和「IC 通路基礎」（進度 80%）
- 其他背景角色有不同進度

### 8.3 Demo 陪跑計畫（2 個）

| 計畫 | 教練 | 學員 | 方法論 | 狀態 |
|------|------|------|--------|------|
| MEDDIC 實戰養成 | 張淑芬 | 陳柏翰 | MEDDIC | active |
| 新人快速上手 | 張淑芬 | 王小明 | GROW | active |

- 陳柏翰已完成 4 次 Session，每次有筆記和行動項目
- 能力評估：3 個月前 vs 現在有明顯成長

### 8.4 Demo 客戶與商機

| 客戶 | 分級 | 產業 | 商機數 |
|------|------|------|--------|
| 德州儀器 (TI) | tier1 | 半導體原廠 | 3 |
| 亞德諾 (ADI) | tier1 | 類比IC | 2 |
| 恩智浦 (NXP) | tier1 | 車用IC | 2 |
| 意法半導體 (STM) | tier2 | MCU | 2 |
| 瑞薩 (Renesas) | tier2 | 車用IC | 1 |
| 新唐科技 | tier3 | MCU/IoT | 2 |
| 群光電子 | tier3 | 系統廠 | 1 |

- 總計 13 個商機，分佈在 Pipeline 各階段
- 包含已成交（Won）和已流失（Lost）

### 8.5 Demo 業績目標

| 人員 | Q1 目標 | Q1 實績 | 達成率 |
|------|---------|---------|--------|
| 林志明（團隊） | NT$80M | NT$62M | 78% |
| 陳柏翰 | NT$15M | NT$10.5M | 70% |
| 其他業務 A | NT$20M | NT$18M | 90% |
| 其他業務 B | NT$25M | NT$21M | 84% |

### 8.6 Demo 通知

- 「陳柏翰完成 MEDDIC 第 3 模組」（2 小時前）
- 「商機 TI 車用 MCU 進入 Negotiation」（昨天）
- 「張淑芬完成陳柏翰第 4 次陪跑 Session」（2 天前）
- 「新商機 NXP iMX9 Design-in 已建立」（3 天前）
- 「月度業績報告已產生」（1 週前）
