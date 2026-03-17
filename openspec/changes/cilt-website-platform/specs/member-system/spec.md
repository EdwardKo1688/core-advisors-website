## ADDED Requirements

### Requirement: Member registration with email verification
The system SHALL provide a registration form with fields: email (unique, required), password (min 8 chars, required), confirm password (required), name (required), phone (required), company (optional), title (optional). Upon successful registration, the system SHALL create an unverified account, send a verification email with a token link (expires in 24 hours), and activate the account when the user clicks the link.

#### Scenario: Successful registration
- **WHEN** user submits valid registration form with unique email
- **THEN** the system creates an account with email_verified=0, sends verification email, and displays "註冊成功，請至信箱驗證"

#### Scenario: Duplicate email registration
- **WHEN** user submits registration with an email that already exists
- **THEN** the system returns error "此 Email 已被註冊"

#### Scenario: Email verification
- **WHEN** user clicks the verification link within 24 hours
- **THEN** the system sets email_verified=1 and redirects to login page with success message

#### Scenario: Expired verification link
- **WHEN** user clicks a verification link after 24 hours
- **THEN** the system displays "驗證連結已過期" and offers to resend verification email

### Requirement: Member login and logout
The system SHALL provide login via email and password. Successful login SHALL return a JWT token (7-day expiry) stored in HttpOnly Cookie and member profile data. Logout SHALL clear the JWT cookie.

#### Scenario: Successful login
- **WHEN** user submits correct email and password for a verified account
- **THEN** the system returns JWT token in HttpOnly Cookie and redirects to member dashboard

#### Scenario: Login with unverified account
- **WHEN** user submits correct credentials for an unverified account
- **THEN** the system returns error "請先完成 Email 驗證" with option to resend

#### Scenario: Failed login (wrong credentials)
- **WHEN** user submits incorrect email or password
- **THEN** the system returns error "Email 或密碼錯誤" (no indication of which is wrong)

#### Scenario: Login rate limiting
- **WHEN** user fails login 5 times within 15 minutes
- **THEN** the system blocks further login attempts for 15 minutes

### Requirement: Password reset flow
The system SHALL provide a forgot password flow: user enters email → system sends reset link (expires in 1 hour) → user sets new password via the link.

#### Scenario: Password reset request
- **WHEN** user submits forgot password form with a registered email
- **THEN** the system sends a reset link email and displays "重設連結已寄出"

#### Scenario: Password reset with valid token
- **WHEN** user clicks reset link within 1 hour and submits new password (min 8 chars)
- **THEN** the system updates the password hash and redirects to login page

### Requirement: Member dashboard
The system SHALL provide a member dashboard showing: welcome message with member name, current CILT certification level, recent course registrations (last 5), certification progress timeline, and payment reminders (unpaid registrations).

#### Scenario: Member views dashboard
- **WHEN** authenticated member navigates to member dashboard
- **THEN** the system displays personalized welcome, CILT level, recent registrations, certification progress, and any unpaid items

### Requirement: Member profile management
The system SHALL allow members to view and edit their profile (name, phone, company, title, avatar) and change their password (requires current password verification).

#### Scenario: Member updates profile
- **WHEN** member submits updated profile information
- **THEN** the system saves changes and displays success message

#### Scenario: Member changes password
- **WHEN** member provides correct current password and valid new password
- **THEN** the system updates the password hash and displays success message

### Requirement: Member certification tracking
The system SHALL display the member's CILT certification history as a timeline showing: current level, date achieved, and recommended next level with required qualifications.

#### Scenario: Member views certification progress
- **WHEN** member with Level 2 certification views their certification page
- **THEN** the system shows Level 2 as current, history of Level 1 achievement, and Level 3 requirements as next goal

### Requirement: Member registration history
The system SHALL list all course/activity registrations for the authenticated member with: course title, date, status (待繳費/已繳費/已取消), and ability to cancel unpaid registrations.

#### Scenario: Member cancels unpaid registration
- **WHEN** member clicks cancel on a registration with status「待繳費」
- **THEN** the system updates status to「已取消」and releases the enrollment slot

### Requirement: Member payment history
The system SHALL list all payment records for the authenticated member with: course title, amount, payment method, status (待付款/已付款/已退款), date, and receipt download for paid items.

#### Scenario: Member downloads receipt
- **WHEN** member clicks download receipt on a paid payment record
- **THEN** the system generates and downloads a PDF receipt

### Requirement: Member API endpoints
The system SHALL provide authenticated member API endpoints:
- `POST /api/auth/register` — registration
- `GET /api/auth/verify-email?token=xxx` — email verification
- `POST /api/auth/login` — login (returns JWT)
- `POST /api/auth/logout` — logout
- `POST /api/auth/forgot-password` — request reset
- `POST /api/auth/reset-password` — execute reset
- `GET /api/members/me` — get profile
- `PUT /api/members/me` — update profile
- `PUT /api/members/me/password` — change password
- `GET /api/registrations/my` — my registrations
- `GET /api/payments/my` — my payments

#### Scenario: Unauthenticated access to member endpoint
- **WHEN** client requests `GET /api/members/me` without valid JWT
- **THEN** the API returns 401 Unauthorized
