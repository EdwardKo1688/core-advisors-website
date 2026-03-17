## ADDED Requirements

### Requirement: Admin authentication
The system SHALL restrict admin access to users with role「admin」. Admin login SHALL use the same JWT mechanism as member login. The admin panel SHALL redirect to login page if no valid admin JWT is present.

#### Scenario: Non-admin attempts admin access
- **WHEN** a member with role「member」navigates to admin panel
- **THEN** the system returns 403 Forbidden and redirects to homepage

#### Scenario: Admin logs in
- **WHEN** admin submits valid credentials
- **THEN** the system issues JWT with admin role and redirects to admin dashboard

### Requirement: Dashboard with KPIs
The admin dashboard SHALL display KPI cards: total members / new this month, total registrations / this month, revenue statistics (monthly/quarterly/yearly), and pending items count (unread contact forms, pending registrations). Below KPIs, a trend chart SHALL show monthly registration and revenue trends.

#### Scenario: Admin views dashboard
- **WHEN** admin navigates to admin dashboard
- **THEN** KPI cards display current statistics and trend chart shows last 12 months of data

### Requirement: Member management (CRM)
The system SHALL provide member management with: searchable/filterable list (by keyword, role, status, CILT level), member detail view (full profile, registration history, payment history), edit capability (basic info, CILT level, role, status), activate/deactivate accounts, and CSV export.

#### Scenario: Admin searches members
- **WHEN** admin enters keyword「王」and selects filter CILT Level 3
- **THEN** the system displays members matching both criteria with pagination

#### Scenario: Admin exports members to CSV
- **WHEN** admin clicks the export button
- **THEN** the system generates and downloads a CSV file with all member data (excluding password hashes)

#### Scenario: Admin updates member CILT level
- **WHEN** admin changes a member's CILT level from 2 to 3
- **THEN** the system updates the member record and logs the change

### Requirement: Content management (CMS)
The system SHALL provide a unified CMS interface for managing 4 content types (news, activities, downloads, columns) with: list view with search/filter/status filter, create form with image/file upload, edit form (pre-filled), soft-delete (toggle is_published), and publish/unpublish toggle.

#### Scenario: Admin creates a news item with image
- **WHEN** admin fills the news form with title, category, content, and uploads an image
- **THEN** the system saves the news item, stores the uploaded image, and the item appears in public news listing

#### Scenario: Admin unpublishes an activity
- **WHEN** admin toggles an activity's publish status to off
- **THEN** the activity's is_published is set to 0 and it no longer appears in public listings

### Requirement: Registration management
The system SHALL provide registration management with: list view filterable by status, payment_status, and course, ability to view registration details (member info, course info, payment info), and status update capability.

#### Scenario: Admin filters registrations by payment status
- **WHEN** admin selects filter payment_status「unpaid」
- **THEN** only registrations with unpaid status are displayed

### Requirement: Payment management
The system SHALL provide payment management with: list view filterable by status and date range, summary statistics (total amount, paid count, pending count), and individual payment detail view with ECPay transaction reference.

#### Scenario: Admin views monthly revenue
- **WHEN** admin selects date range for current month
- **THEN** the system displays all payments in that range with summary statistics (total revenue, number of paid transactions)

### Requirement: Contact form management
The system SHALL provide contact form management with: list view filterable by read/unread status and inquiry category, ability to mark as read, and admin notes field for internal tracking.

#### Scenario: Admin reads and marks a contact form
- **WHEN** admin opens an unread contact submission and clicks「標記已讀」
- **THEN** the system updates is_read to 1 and the item moves to read list

### Requirement: Admin API endpoints
The system SHALL provide admin-only API endpoints (all requiring admin role JWT):
- `GET /api/admin/members` — list with filters
- `PUT /api/admin/members/:id` — update member
- `GET /api/admin/members/export` — CSV export
- `POST/PUT/DELETE /api/admin/news/:id` — news CRUD
- `POST/PUT/DELETE /api/admin/activities/:id` — activities CRUD
- `POST/PUT/DELETE /api/admin/downloads/:id` — downloads CRUD (with file upload)
- `POST/PUT/DELETE /api/admin/columns/:id` — columns CRUD
- `GET /api/admin/registrations` — list with filters
- `PUT /api/admin/registrations/:id` — update status
- `GET /api/admin/payments` — list with filters and summary
- `GET /api/admin/contacts` — list with filters
- `PUT /api/admin/contacts/:id/read` — mark as read
- `GET /api/admin/dashboard` — aggregated KPI data

#### Scenario: Admin API authorization check
- **WHEN** a non-admin JWT is used to access any admin endpoint
- **THEN** the API returns 403 Forbidden
