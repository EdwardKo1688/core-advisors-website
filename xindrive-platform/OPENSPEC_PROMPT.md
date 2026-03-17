# 芯智驅 XinDrive AI — OpenSpec 完整開發提示詞
# Complete Development Prompt for Claude Code (SDD OpenSpec Standard)
# Version: 2.0 | Date: 2026-03-15

---

## 指令說明

> 本文件為「芯智驅 XinDrive AI 多公司商務發展與管理平台」的完整開發規格提示詞。
> 遵循 **SDD (Specification-Driven Development)** 的 **OpenSpec** 方法論。
> 請在 Claude Code 環境中，依照本文件逐步建構完整的生產級應用。

---

## PART 1: PROJECT IDENTITY

### 品牌定義

```yaml
Brand:
  Name_ZH: 芯智驅
  Name_EN: XinDrive AI
  Tagline_ZH: 不忘初心，AI倍增
  Tagline_EN: "From IC Knowledge to Results — Powered by AI"
  Domain: xindrive.ai
  Founder: Alvin (edwardko1688@gmail.com)
  Industry: IC Distribution / Smart Logistics / Digital Transformation

Pillars:
  - ID: LEARN
    Name_ZH: 驅・知
    Name_EN: XinDrive Learn
    Purpose: 培訓體系 — KM 知識管理、課程設計、技能評量
    Color: "#2563EB"

  - ID: COACH
    Name_ZH: 驅・伴
    Name_EN: XinDrive Coach
    Purpose: 陪跑教練 — AI Agent、GROW/MEDDIC/SPIN、實戰模擬
    Color: "#10B981"

  - ID: BOOST
    Name_ZH: 驅・效
    Name_EN: XinDrive Boost
    Purpose: 業績倍增 — CRM、Pipeline、KPI、報表分析
    Color: "#F59E0B"

Frameworks:
  - LEAP: Learn → Engage → Accelerate → Perform (員工發展四階段)
  - OpenClaw: AI 智能推薦引擎 (技能匹配 × 自適應學習 × 跨產業知識庫)
  - Seven_Dimensions: [數位工具, 數據分析, AI協作, 資安合規, 數位協作, 創新思維, 產業專業]
```

### 設計規範

```yaml
Colors:
  Primary:
    navy-dark: "#0a1628"
    navy-mid: "#111f38"
    navy-light: "#1a2e50"
  Accent:
    teal: "#2dd4a8"
    teal-dark: "#0d9b8a"
  Pillar:
    learn: "#2563EB"
    coach: "#10B981"
    boost: "#F59E0B"
  Semantic:
    success: "#10B981"
    warning: "#F59E0B"
    error: "#EF4444"
    info: "#00B4D8"
  Neutral:
    text-dark: "#1E293B"
    text-muted: "#8B9DAF"
    bg-light: "#F1F5F9"
    border: "#E2E8F0"
    ice-blue: "#CADCFC"

Typography:
  Font_ZH: "Noto Sans TC" (Google Fonts, weights: 400, 500, 700)
  Font_EN: "Inter" (Google Fonts, weights: 400, 500, 600, 700)
  Font_Code: "JetBrains Mono"
  Scale: [12, 14, 16, 18, 20, 24, 30, 36, 48]px
  Line_Height: 1.5 (body), 1.2 (headings)

Spacing:
  Unit: 4px base (0.25rem)
  Scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]px
  Container_Max: 1280px
  Sidebar_Width: 260px

Border_Radius: [4, 8, 12, 16]px
Shadow:
  sm: "0 1px 2px rgba(0,0,0,0.05)"
  md: "0 4px 6px rgba(0,0,0,0.07)"
  lg: "0 10px 15px rgba(0,0,0,0.1)"
```

---

## PART 2: ARCHITECTURE

### 技術架構

```yaml
Architecture: Multi-Tenant SaaS (Row Level Security)

Frontend:
  Type: Single Page Application (SPA)
  Framework: Pure Vanilla JavaScript (零外部框架依賴)
  DOM_Helper: "h(tag, attrs, children) — 自建 DOM 創建函數"
  Routing: Hash-based (#/dashboard, #/learn, #/coach/sessions, etc.)
  State: "Global state object + render() function"
  Charts: Chart.js 4.4.0 (CDN)
  Icons: Lucide Icons (CDN or inline SVG)
  CSS: CSS Variables + Utility Classes (自建)

Backend:
  Platform: Supabase
  Database: PostgreSQL 15+
  Auth: Supabase Auth (email/password + SSO ready)
  API: Supabase REST API (auto-generated from schema)
  Realtime: Supabase Realtime (WebSocket subscriptions)
  Storage: Supabase Storage (for file uploads)
  Security: Row Level Security (RLS) — per-organization data isolation

Data_Layer:
  Abstraction: "DB.get(table, filters) / DB.set(table, id, data)"
  Demo_Mode: "localStorage-based with seedable demo data"
  Toggle: "API_ENABLED flag in config — false = demo, true = Supabase"

Deployment:
  Frontend: GitHub Pages / Vercel / Netlify (static hosting)
  Backend: Supabase Cloud (managed)
  CI_CD: GitHub Actions
```

### 資料夾結構

```
xindrive-platform/
├── openspec/
│   ├── specs/          # 現行規格 (Source of Truth)
│   │   ├── system.md
│   │   ├── data-model.md
│   │   └── modules.md
│   └── changes/        # 變更提案
│       └── CHG-xxx.md
├── src/
│   ├── index.html      # SPA 入口 + 所有路由
│   ├── css/
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── js/
│   │   ├── app.js          # 主應用 + 路由
│   │   ├── db.js           # 資料層抽象
│   │   ├── auth.js         # 認證模組
│   │   ├── config.js       # 環境設定
│   │   ├── components/
│   │   │   ├── sidebar.js
│   │   │   ├── navbar.js
│   │   │   ├── modal.js
│   │   │   ├── table.js
│   │   │   ├── chart.js
│   │   │   ├── form.js
│   │   │   └── toast.js
│   │   ├── pages/
│   │   │   ├── login.js
│   │   │   ├── dashboard.js
│   │   │   ├── learn/
│   │   │   │   ├── courses.js
│   │   │   │   ├── progress.js
│   │   │   │   └── assessment.js
│   │   │   ├── coach/
│   │   │   │   ├── plans.js
│   │   │   │   ├── sessions.js
│   │   │   │   └── skill-assessment.js
│   │   │   ├── boost/
│   │   │   │   ├── customers.js
│   │   │   │   ├── pipeline.js
│   │   │   │   └── targets.js
│   │   │   ├── admin/
│   │   │   │   ├── users.js
│   │   │   │   ├── roles.js
│   │   │   │   └── org-settings.js
│   │   │   └── settings.js
│   │   └── utils/
│   │       ├── dom.js       # h() helper
│   │       ├── format.js    # 格式化工具
│   │       ├── validate.js  # 驗證
│   │       └── seed.js      # Demo 資料種子
│   └── assets/
│       ├── logo.svg
│       └── icons/
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql
│   │   ├── 002_rls.sql
│   │   └── 003_seed.sql
│   └── config.toml
├── .claude/
│   └── launch.json
├── CLAUDE.md
└── README.md
```

---

## PART 3: DATA MODEL (完整資料庫 Schema)

### 核心表

```sql
-- ============================================================
-- ORGANIZATION (多公司租戶)
-- ============================================================
CREATE TABLE organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  industry    TEXT CHECK (industry IN ('ic_distribution', 'smart_logistics', 'manufacturing', 'tech_startup', 'general')),
  plan        TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  max_users   INT DEFAULT 5,
  logo_url    TEXT,
  settings    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS & ROLES (RBAC)
-- ============================================================
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  department  TEXT,
  position    TEXT,
  phone       TEXT,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, email)
);

CREATE TABLE roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  is_system   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

-- System roles per org: super_admin, org_admin, manager, trainer, employee
-- Permissions: ["learn:read", "learn:write", "coach:read", "coach:write",
--   "boost:read", "boost:write", "admin:users", "admin:settings", "admin:billing"]

CREATE TABLE user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id     UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- ============================================================
-- LEARN MODULE (驅・知)
-- ============================================================
CREATE TABLE courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,  -- 'sales_methodology', 'supply_chain', 'digital_skills', 'ai_tools', 'industry_specific'
  difficulty  TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_hours NUMERIC(5,1),
  thumbnail_url TEXT,
  industry_track TEXT, -- 'ic_distribution', 'smart_logistics', 'general_digital'
  leap_stage  TEXT CHECK (leap_stage IN ('learn', 'engage', 'accelerate', 'perform')),
  is_published BOOLEAN DEFAULT FALSE,
  tags        TEXT[] DEFAULT '{}',
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE module_lessons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('video', 'article', 'quiz', 'exercise', 'simulation')),
  content_url TEXT,
  content_data JSONB DEFAULT '{}',
  duration_min INT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  progress    NUMERIC(5,2) DEFAULT 0,
  score       NUMERIC(5,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE TABLE lesson_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id   UUID REFERENCES module_lessons(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  time_spent_sec INT DEFAULT 0,
  score       NUMERIC(5,2),
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, lesson_id)
);

-- ============================================================
-- COACH MODULE (驅・伴)
-- ============================================================
CREATE TABLE coaching_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  coachee_id  UUID REFERENCES users(id),
  coach_id    UUID REFERENCES users(id),
  title       TEXT NOT NULL,
  methodology TEXT, -- 'GROW', 'MEDDIC', 'SPIN', 'Challenger', 'Custom'
  status      TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  goals       JSONB DEFAULT '[]',
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coaching_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID REFERENCES coaching_plans(id) ON DELETE CASCADE,
  session_type TEXT CHECK (session_type IN ('1on1', 'group', 'simulation', 'review')),
  title       TEXT NOT NULL,
  notes       TEXT,
  action_items JSONB DEFAULT '[]',
  scheduled_at TIMESTAMPTZ,
  duration_min INT,
  status      TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skill_assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  assessment_type TEXT DEFAULT 'seven_dimension',
  scores      JSONB NOT NULL,
  -- scores: { "digital_tools": 3.2, "data_analysis": 2.8, "ai_collaboration": 2.1,
  --   "security_compliance": 3.5, "digital_communication": 3.8,
  --   "innovation": 2.9, "industry_expertise": 3.6 }
  targets     JSONB,
  -- targets: same keys as scores, with target values
  overall_score NUMERIC(3,1),
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  next_assessment DATE
);

-- ============================================================
-- BOOST MODULE (驅・效)
-- ============================================================
CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  industry    TEXT,
  type        TEXT CHECK (type IN ('prospect', 'active', 'key_account', 'churned')),
  size        TEXT CHECK (size IN ('smb', 'mid', 'enterprise')),
  region      TEXT,
  owner_id    UUID REFERENCES users(id),
  contact_count INT DEFAULT 0,
  annual_revenue NUMERIC(15,2),
  notes       TEXT,
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  title       TEXT,
  email       TEXT,
  phone       TEXT,
  is_primary  BOOLEAN DEFAULT FALSE,
  linkedin_url TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  title       TEXT NOT NULL,
  stage       TEXT DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  amount      NUMERIC(15,2),
  probability INT CHECK (probability BETWEEN 0 AND 100),
  owner_id    UUID REFERENCES users(id),
  expected_close DATE,
  product_line TEXT, -- which pillar/product
  methodology_data JSONB DEFAULT '{}',
  -- For MEDDIC: { metrics, economic_buyer, decision_criteria, decision_process, identify_pain, champion }
  notes       TEXT,
  closed_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunity_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  type        TEXT CHECK (type IN ('call', 'email', 'meeting', 'demo', 'proposal', 'note')),
  title       TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE targets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  period      TEXT NOT NULL,  -- '2026-Q1', '2026-M03', '2026'
  metric      TEXT NOT NULL,  -- 'revenue', 'deals_closed', 'new_customers', 'pipeline_value'
  target_value NUMERIC(15,2) NOT NULL,
  actual_value NUMERIC(15,2) DEFAULT 0,
  unit        TEXT DEFAULT 'USD',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SYSTEM TABLES
-- ============================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT,
  link        TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPER ADMIN (集團管理)
-- ============================================================
CREATE TABLE super_admins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  level       TEXT DEFAULT 'admin' CHECK (level IN ('admin', 'viewer')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_org ON courses(org_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_customers_org ON customers(org_id);
CREATE INDEX idx_opportunities_org ON opportunities(org_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_coaching_plans_org ON coaching_plans(org_id);
CREATE INDEX idx_skill_assessments_user ON skill_assessments(user_id);
CREATE INDEX idx_activity_log_org ON activity_log(org_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

### Row Level Security

```sql
-- Every table with org_id must enforce tenant isolation
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (apply similar to all org-scoped tables)
CREATE POLICY "Users can only see their org data" ON users
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Org-scoped courses" ON courses
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- Super admins bypass RLS
CREATE POLICY "Super admin full access" ON organizations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );
```

---

## PART 4: MODULE SPECIFICATIONS

### AUTH Module — 權限管理

```yaml
Routes:
  - "#/login"           → LoginPage
  - "#/register"        → RegisterPage (org self-registration for Free plan)

Features:
  - Email/Password login via Supabase Auth
  - Demo mode: admin/admin → auto-login with seeded data
  - RBAC with 5 system roles: super_admin, org_admin, manager, trainer, employee
  - Permission matrix:
      super_admin: ALL (cross-org)
      org_admin:   learn:*, coach:*, boost:*, admin:users, admin:settings
      manager:     learn:read, coach:*, boost:*, dashboard:read
      trainer:     learn:*, coach:read
      employee:    learn:read (own enrollments), coach:read (own plans), boost:read (own targets)
  - Session persistence (localStorage token)
  - Auto-redirect to #/login if unauthenticated
```

### LEARN Module — 驅・知 培訓體系

```yaml
Routes:
  - "#/learn"               → CourseCatalog
  - "#/learn/course/:id"    → CourseDetail (modules + lessons)
  - "#/learn/progress"      → MyProgress (enrollment dashboard)
  - "#/learn/assessment"    → SkillAssessment (七維度診斷)
  - "#/learn/admin"         → CourseAdmin (CRUD, for trainers+)

Features:
  Course_Catalog:
    - Grid/list view toggle
    - Filter by: category, difficulty, industry_track, leap_stage
    - Search by title/description
    - Progress indicator per course
    - "Enroll" CTA button

  Course_Detail:
    - Hero section with title, description, metadata
    - Module accordion with lessons
    - Lesson types: video (embed), article (markdown), quiz (interactive), simulation
    - Progress tracker (X/Y lessons completed)
    - Certificate generation on completion

  My_Progress:
    - Active enrollments with progress bars
    - Completed courses with scores
    - LEAP stage visualization
    - Total hours logged
    - Recommended next courses (OpenClaw suggestion)

  Skill_Assessment:
    - Seven-dimension radar chart
    - Self-assessment questionnaire (5-point scale per dimension)
    - Manager assessment (360-degree)
    - Gap analysis: current vs target
    - Historical trend chart
    - AI-generated learning path recommendation

  Course_Admin:
    - CRUD courses, modules, lessons
    - Drag-and-drop reorder
    - Publish/unpublish toggle
    - Bulk import (CSV)
    - Analytics: enrollment count, completion rate, avg score
```

### COACH Module — 驅・伴 陪跑教練

```yaml
Routes:
  - "#/coach"               → CoachingDashboard
  - "#/coach/plans"         → PlanList
  - "#/coach/plan/:id"      → PlanDetail (sessions + goals)
  - "#/coach/sessions"      → SessionCalendar
  - "#/coach/assessment"    → SkillDashboard (linked from LEARN)

Features:
  Coaching_Dashboard:
    - Active plans summary (coach view / coachee view)
    - Upcoming sessions calendar widget
    - Quick stats: total sessions, avg rating, goals achieved
    - Methodology breakdown (GROW/MEDDIC/SPIN distribution)

  Plan_Management:
    - Create plan: assign coachee, select methodology, set goals
    - Goal tracking with progress (0-100%)
    - Session log with notes and action items
    - Plan timeline visualization

  Session_Management:
    - Calendar view (week/month)
    - Session types: 1:1, group, simulation, review
    - Pre-session checklist (methodology-specific)
    - Post-session notes + action items + rating
    - Reminders and follow-ups

  AI_Coach_Agent:
    - Virtual coaching assistant (chat interface)
    - Methodology guidance (step-by-step GROW/MEDDIC/SPIN prompts)
    - Role-play simulation mode
    - Real-time feedback on sales pitch
    - Suggested talking points based on customer data
```

### BOOST Module — 驅・效 業績倍增

```yaml
Routes:
  - "#/boost/customers"         → CustomerList
  - "#/boost/customer/:id"      → CustomerDetail (contacts + opportunities)
  - "#/boost/pipeline"          → PipelineKanban
  - "#/boost/opportunity/:id"   → OpportunityDetail
  - "#/boost/targets"           → TargetDashboard
  - "#/boost/reports"           → ReportBuilder

Features:
  Customer_Management:
    - Table view with sorting, filtering, search
    - Customer card: name, industry, type, size, owner, revenue
    - Contact list per customer
    - Activity timeline
    - Opportunity history

  Pipeline_Kanban:
    - 6 columns: Lead → Qualified → Proposal → Negotiation → Won → Lost
    - Drag-and-drop stage transitions
    - Card shows: title, customer, amount, probability, owner, expected close
    - Pipeline value summary per stage
    - Weighted pipeline calculation

  Opportunity_Detail:
    - MEDDIC scorecard (6 criteria with status indicators)
    - Activity log (calls, emails, meetings, demos)
    - Stage history timeline
    - Probability auto-calculation based on methodology score
    - Related contacts and decision makers

  Target_Dashboard:
    - Period selector (monthly/quarterly/yearly)
    - Revenue target vs actual (bar chart)
    - Deals closed target vs actual
    - Leaderboard (team ranking)
    - Trend analysis (month-over-month)
    - Forecast based on weighted pipeline

  Report_Builder:
    - Pre-built reports: Revenue, Pipeline, Win Rate, Cycle Time
    - Date range selector
    - Export to CSV/PDF
    - Chart types: bar, line, pie, funnel
```

### DASHBOARD Module — 儀表板

```yaml
Routes:
  - "#/dashboard"              → MainDashboard
  - "#/dashboard/analytics"    → DeepAnalytics
  - "#/admin/super"            → SuperAdminDashboard (cross-org)

Features:
  Main_Dashboard:
    - Welcome banner with user name + role + org
    - 4 KPI cards: Active Learners, Course Completion Rate, Pipeline Value, Revenue Progress
    - Recent activity feed
    - Quick links to each module
    - Upcoming sessions/deadlines
    - LEAP stage distribution chart (donut)

  Deep_Analytics:
    - Training ROI calculator
    - Skill gap heatmap (team × dimension)
    - Course effectiveness ranking
    - Coaching impact metrics
    - Revenue correlation analysis

  Super_Admin:
    - Cross-org overview table
    - Per-company KPI comparison
    - Active users trend
    - Platform usage metrics
    - Billing summary
    - Organization management (CRUD)
```

### SETTINGS Module

```yaml
Routes:
  - "#/settings"                → UserProfile
  - "#/settings/org"            → OrgSettings (admin only)
  - "#/settings/users"          → UserManagement (admin only)
  - "#/settings/roles"          → RoleManagement (admin only)
  - "#/settings/integrations"   → IntegrationSettings (admin only)

Features:
  - Profile editing (name, avatar, department, phone)
  - Password change
  - Notification preferences
  - Organization settings (name, logo, industry, plan)
  - User CRUD (invite by email, assign roles)
  - Role editor (create custom roles, assign permissions)
  - Integration configuration (future: HR/ERP/LMS webhooks)
```

---

## PART 5: UI COMPONENTS

### Core Components to Build

```yaml
Components:
  Layout:
    - AppShell: sidebar + main content area
    - Sidebar: collapsible, sections for each module, active state
    - Navbar: org name, search, notifications, user menu
    - PageHeader: title, subtitle, breadcrumb, action buttons

  Data_Display:
    - DataTable: sortable, filterable, paginated, selectable rows
    - KPICard: icon, value, label, trend indicator (+/-)
    - StatGroup: horizontal row of KPICards
    - ProgressBar: value, max, color, label
    - Badge: colored tag with text
    - EmptyState: illustration + message + CTA

  Form:
    - FormField: label, input, validation message, required indicator
    - Select: searchable dropdown
    - DatePicker: calendar popup
    - FileUpload: drag-and-drop area
    - Toggle: switch component
    - TagInput: multi-value tag input

  Overlay:
    - Modal: header, body, footer, sizes (sm/md/lg/xl)
    - SlideOver: right-side panel (for details/editing)
    - Toast: success/error/warning/info notifications
    - ConfirmDialog: action confirmation with cancel

  Charts:
    - RadarChart: 7-dimension skill assessment
    - BarChart: targets, revenue, pipeline
    - LineChart: trends, progress over time
    - DonutChart: LEAP distribution, pipeline stages
    - FunnelChart: pipeline conversion
    - MiniBarChart: inline sparkline for tables

  Navigation:
    - Tabs: horizontal tab switching
    - Kanban: drag-and-drop columns
    - Calendar: week/month view with events
    - Timeline: vertical activity log
    - Stepper: multi-step form wizard
```

---

## PART 6: DEMO MODE

### Demo Data Seed

```yaml
Demo_Mode:
  Trigger: "API_ENABLED = false in config.js"
  Storage: localStorage
  Login: admin@xindrive.ai / admin (auto-seed on first login)

  Seed_Data:
    Organization:
      name: "芯科大 IC Distribution"
      industry: "ic_distribution"
      plan: "pro"

    Users: 8 users across roles
      - Admin (Alvin, org_admin)
      - Manager x2 (Sales Manager, Training Manager)
      - Trainer x1
      - Employee x4

    Courses: 8 courses spanning LEAP stages
      - MEDDIC 銷售方法論 (learn, intermediate)
      - SPIN Selling 提問技巧 (learn, beginner)
      - Design-in 專案管理 (engage, intermediate)
      - BOM 分析實務 (engage, advanced)
      - AI 銷售助手應用 (accelerate, intermediate)
      - 客戶談判策略 (accelerate, advanced)
      - 業績倍增實戰 (perform, advanced)
      - 數位轉型基礎 (learn, beginner)

    Customers: 8 companies
      - Mix of prospect, active, key_account types
      - Various industries and sizes

    Opportunities: 12 deals across pipeline stages
      - Total pipeline ~$2.5M
      - Win rate ~35%

    Coaching_Plans: 4 active plans
      - GROW, MEDDIC, SPIN, Challenger methodologies

    Targets: quarterly and monthly targets for each salesperson

    Skill_Assessments: 6 assessments with 7-dimension scores
```

---

## PART 7: DEVELOPMENT INSTRUCTIONS

### Step-by-Step Build Order

```
Phase 1 — Foundation (Day 1-2)
  1. Create folder structure
  2. Build h() DOM helper + CSS variables
  3. Build AppShell (sidebar + navbar + main area)
  4. Build hash router with auth guard
  5. Build DB abstraction layer (localStorage mode)
  6. Build Login page + demo auth
  7. Seed demo data on first login

Phase 2 — Dashboard (Day 3)
  8. Build KPICard, StatGroup components
  9. Build MainDashboard with 4 KPIs + activity feed
  10. Build chart components (radar, bar, donut)

Phase 3 — LEARN Module (Day 4-5)
  11. Build DataTable component
  12. Build CourseCatalog (grid + filters)
  13. Build CourseDetail (modules + lessons)
  14. Build MyProgress (enrollment tracking)
  15. Build SkillAssessment (7-dimension radar)

Phase 4 — COACH Module (Day 6-7)
  16. Build CoachingDashboard
  17. Build Plan CRUD + goal tracking
  18. Build Session management + calendar
  19. Build AI Coach chat interface (mock)

Phase 5 — BOOST Module (Day 8-9)
  20. Build CustomerList + CustomerDetail
  21. Build Kanban component
  22. Build Pipeline view + drag-and-drop
  23. Build OpportunityDetail + MEDDIC scorecard
  24. Build TargetDashboard + charts

Phase 6 — Admin & Settings (Day 10)
  25. Build UserManagement CRUD
  26. Build RoleEditor
  27. Build OrgSettings
  28. Build SuperAdmin dashboard (cross-org)

Phase 7 — Polish & Integration (Day 11-12)
  29. Add Toast notifications
  30. Add Modal/SlideOver for all CRUD operations
  31. Responsive design (mobile sidebar collapse)
  32. Keyboard shortcuts (Cmd+K search)
  33. Export functionality (CSV/PDF)
  34. Prepare Supabase migration scripts
```

### Coding Standards

```yaml
Standards:
  JS:
    - Pure Vanilla JS, no frameworks
    - ES6+ syntax (const/let, arrow functions, template literals, destructuring)
    - h(tag, attrs, children) for all DOM creation
    - No innerHTML for user-provided content (XSS prevention)
    - Event delegation where possible
    - Async/await for all async operations

  CSS:
    - CSS Custom Properties (variables) for all colors, spacing, fonts
    - Mobile-first responsive design
    - BEM-like naming: .sidebar, .sidebar__item, .sidebar__item--active
    - No !important
    - Dark mode via prefers-color-scheme (stretch goal)

  HTML:
    - Single index.html entry point
    - Semantic HTML5 elements
    - ARIA attributes for accessibility
    - <script type="module"> for JS modules

  Data:
    - All dates in ISO 8601 format
    - All monetary values in minor currency units (cents)
    - UUIDs for all primary keys
    - JSONB for flexible schema fields

  Performance:
    - Lazy load pages (dynamic import on route change)
    - Virtual scrolling for large lists (>100 items)
    - Debounce search inputs (300ms)
    - Cache frequently accessed data in state
```

### OpenSpec Workflow

```
When making changes to the platform:

1. Create a change proposal:
   openspec/changes/CHG-xxx.md
   - Describe what changed and why
   - List affected specs

2. Update the specs:
   openspec/specs/*.md
   - Keep specs as source of truth
   - Version-stamp updates

3. Implement the code:
   src/js/...
   - Follow the updated spec exactly

4. Verify:
   - Run the preview server (python3 -m http.server 8080)
   - Test all affected routes
   - Check responsive layout
   - Verify demo data works
```

---

## PART 8: LAUNCH CONFIGURATION

### Claude Code Settings

```json
// .claude/launch.json
{
  "preview": {
    "command": "cd src && python3 -m http.server 8080",
    "url": "http://localhost:8080"
  }
}
```

### CLAUDE.md (Project Instructions)

```markdown
# 芯智驅 XinDrive AI Platform

## Quick Start
cd src && python3 -m http.server 8080

## Architecture
- Pure Vanilla JS SPA (zero dependencies)
- h(tag, attrs, children) DOM helper
- Hash-based routing (#/dashboard, #/learn, etc.)
- localStorage demo mode (DB.get/set abstraction)
- CSS variables for theming

## SDD OpenSpec
- specs/ = source of truth
- changes/ = proposed modifications
- Always update specs before coding

## Colors
--navy-dark: #0a1628; --teal: #2dd4a8;
--learn: #2563EB; --coach: #10B981; --boost: #F59E0B;

## Modules
LEARN (驅・知): courses, progress, skill assessment
COACH (驅・伴): coaching plans, sessions, AI coach
BOOST (驅・效): CRM, pipeline, targets, reports
ADMIN: users, roles, org settings, super admin
```

---

## END OF OPENSPEC PROMPT

> **使用方式**：將本文件完整提供給 Claude Code，指示它按照 Phase 1-7 的順序逐步建構。
> 每完成一個 Phase，請執行 preview server 驗證，再進入下一階段。
> 所有規格以本文件為最高準則 (Single Source of Truth)。
