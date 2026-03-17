## ADDED Requirements

### Requirement: Course listing for registration
The system SHALL display available courses as cards with: title, type tag (研討會/一般課程/認證課程), description, dates, location, fee (NTD), available seats. The listing SHALL support type filtering, date range filtering, keyword search, and pagination (9 items per page). Only courses with status「open」and is_published=1 SHALL appear.

#### Scenario: User views available courses
- **WHEN** user navigates to the registration page
- **THEN** published, open courses are displayed as cards with filtering and search options

#### Scenario: Course with no available seats
- **WHEN** a course's enrolled_count equals max_seats
- **THEN** the registration button is disabled and displays「額滿」

### Requirement: Course registration flow
The system SHALL implement a 4-step registration flow: 1) Select course → 2) Confirm member data → 3) Online payment → 4) Registration complete. Registration SHALL require member authentication. The system SHALL prevent duplicate registration for the same course.

#### Scenario: Member registers for a course
- **WHEN** authenticated member selects a course and confirms
- **THEN** the system creates a registration record with status「pending」and payment_status「unpaid」, and redirects to payment

#### Scenario: Member attempts duplicate registration
- **WHEN** member tries to register for a course they already registered for
- **THEN** the system displays error「您已報名此課程」

#### Scenario: Guest attempts registration
- **WHEN** non-authenticated user clicks register on a course
- **THEN** the system redirects to login page with return URL to the course

### Requirement: ECPay payment integration
The system SHALL integrate with 綠界科技 ECPay for payment processing, supporting: credit card (Visa/MasterCard/JCB), ATM virtual account, and convenience store payment code. Payment flow: create order → redirect to ECPay payment page → ECPay callback updates status → redirect back to result page.

#### Scenario: Successful credit card payment
- **WHEN** member completes credit card payment on ECPay
- **THEN** ECPay sends callback to `/api/payments/callback`, system updates payment status to「paid」and registration status to「confirmed」, member is redirected to success page

#### Scenario: ATM payment pending
- **WHEN** member selects ATM payment on ECPay
- **THEN** system receives virtual account number, displays it to member, and waits for ECPay callback when payment is received

#### Scenario: Payment failure
- **WHEN** ECPay reports payment failure
- **THEN** system updates payment status to「failed」and displays error with retry option

### Requirement: Payment status tracking
The system SHALL track 4 payment statuses: pending (order created, awaiting payment), paid (payment confirmed), failed (payment failed), refunded (refund processed). Status transitions SHALL be logged with timestamps.

#### Scenario: Payment status transitions
- **WHEN** ECPay callback reports successful payment for a pending order
- **THEN** the system updates payment status from「pending」to「paid」, sets paid_at timestamp, and updates registration status to「confirmed」

### Requirement: Registration and payment API endpoints
The system SHALL provide:
- `GET /api/courses` — list available courses (public)
- `GET /api/courses/:id` — course detail (public)
- `POST /api/registrations` — create registration (auth required, body: { course_id })
- `DELETE /api/registrations/:id` — cancel registration (auth required, only if unpaid)
- `POST /api/payments/create` — initiate payment (auth required, body: { registration_id })
- `POST /api/payments/callback` — ECPay callback endpoint (ECPay server-to-server)
- `GET /api/payments/return` — ECPay redirect back URL

#### Scenario: Create payment for registration
- **WHEN** member submits POST to `/api/payments/create` with valid registration_id
- **THEN** the system creates a payment record, generates ECPay form HTML, and returns it for auto-submission to ECPay

#### Scenario: ECPay callback validation
- **WHEN** ECPay sends callback to `/api/payments/callback`
- **THEN** the system validates the CheckMacValue hash, updates payment and registration status, and returns "1|OK"
