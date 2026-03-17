## ADDED Requirements

### Requirement: Homepage hero and brand showcase
The system SHALL display a hero section with CILT logo, tagline「全球物流專業認證權威」, and CTA buttons (了解認證 / 立即加入). Below hero SHALL show: organization brief (1919 establishment, Royal Charter, 30,000+ global members), four core missions as cards, certification level overview (Level 1-4), latest 5 news items, latest 3 activities, and a join CTA section.

#### Scenario: Visitor lands on homepage
- **WHEN** a visitor navigates to the homepage
- **THEN** the system displays hero section, organization brief, 4 mission cards, certification overview, dynamic news list, dynamic activity list, and CTA section

#### Scenario: Dynamic content loading
- **WHEN** the homepage loads
- **THEN** latest 5 news items and 3 activities are fetched from the API and rendered

### Requirement: About page with sub-navigation
The system SHALL provide an About page with sidebar sub-navigation switching between 4 sections: CILT International Overview (founding 1919, Royal Charter 1926, 30+ countries), Mission Statement (4 core objectives), Taiwan Chapter Introduction (history, organization, services), and International Qualification Recognition.

#### Scenario: User navigates about sub-sections
- **WHEN** user clicks a sidebar sub-navigation item (e.g., 台灣分會簡介)
- **THEN** the corresponding section content displays without page reload (tab-style switching)

### Requirement: Certification zone with four-level display
The system SHALL present the CILT certification system across 5 sidebar sub-pages: CILT Overview, Certification Levels (Level 1-4 with card-style display showing Chinese name, English name, eligibility requirements), Certification Comparison, Target Audience, and Course Introduction.

#### Scenario: User views certification levels
- **WHEN** user navigates to the certification levels sub-page
- **THEN** four level cards display: Level 1 Foundation Certificate, Level 2 Certificate for Supervisory Managers, Level 3 Diploma for Operational Managers, Level 4 Advanced Diploma for Strategic Managers, each with eligibility requirements

### Requirement: Exam information page
The system SHALL display exam schedules (Level 1-2: June/December on Sundays, Level 3: June/December on weekends, Level 4: irregular), exam subjects per level, exam formats (Level 1: multiple choice, Level 2-3: short answer + essay, Level 4: English reports + thesis), and 8 examination rules.

#### Scenario: User views exam schedule
- **WHEN** user navigates to the exam information page
- **THEN** exam schedule table, subjects, formats, and examination rules are displayed

### Requirement: Contact us page with form
The system SHALL provide a contact form with fields: name (required, max 50 chars), email (required, email validation), phone (optional), company (optional), inquiry category (required, select: seminar/course/certification/other), and message (required, max 500 chars). Form SHALL validate in real-time and send notification email to admin upon submission.

#### Scenario: Visitor submits contact form
- **WHEN** visitor fills all required fields with valid data and submits
- **THEN** the system sends notification email to admin, sends confirmation email to visitor, and displays success message

#### Scenario: Visitor submits invalid form
- **WHEN** visitor submits form with missing required fields or invalid email
- **THEN** the system displays inline validation errors without submitting

### Requirement: Shared navigation header
The system SHALL display a fixed top navigation bar with glassmorphism effect containing: CILT logo + full name, 8 main navigation links (關於協會/最新消息/活動資訊/認證專區/線上報名/考試資訊/下載專區/經驗分享), and login/register buttons (or member name/logout when authenticated). Mobile SHALL use hamburger menu with slide-out drawer.

#### Scenario: Mobile navigation
- **WHEN** viewport width is less than 768px
- **THEN** main navigation collapses into a hamburger icon that opens a slide-out drawer menu

### Requirement: Shared footer
The system SHALL display a footer with: association address, phone, fax, CILT logo, copyright notice, quick links, and email newsletter subscription input.

#### Scenario: Footer displays on all pages
- **WHEN** any page loads
- **THEN** the footer with association contact info, logo, and quick links is visible

### Requirement: Breadcrumb navigation
The system SHALL display breadcrumb navigation on all pages except the homepage, in format: 首頁 > Category > Current Page, with each level clickable.

#### Scenario: User is on a sub-page
- **WHEN** user navigates to certification levels page
- **THEN** breadcrumb shows: 首頁 > 認證專區 > 認證分級, with each segment clickable
