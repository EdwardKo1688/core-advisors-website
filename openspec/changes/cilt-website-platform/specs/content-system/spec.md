## ADDED Requirements

### Requirement: News listing and detail
The system SHALL display a news listing page with: date, category tag (課程資訊/協會公告/活動), title. The listing SHALL support category filtering, keyword search, and pagination (10 items per page). Clicking a news item SHALL navigate to a detail page showing full content.

#### Scenario: User filters news by category
- **WHEN** user selects category filter「協會公告」
- **THEN** only news items with category「協會公告」are displayed, with pagination reset to page 1

#### Scenario: User searches news
- **WHEN** user enters keyword「物流」in search field
- **THEN** news items matching the keyword in title or content are displayed

#### Scenario: User views news detail
- **WHEN** user clicks a news item title
- **THEN** the system navigates to a detail view showing full title, date, category, and content

### Requirement: Activities listing with thumbnails
The system SHALL display an activities listing page with thumbnail cards in 3x3 grid layout. Activities SHALL support category filtering (研討會/課程/參訪/論壇/展覽/講座), date range filtering, keyword search, and pagination (9 items per page).

#### Scenario: User filters activities by date range
- **WHEN** user selects a start date and end date
- **THEN** only activities within that date range are displayed

#### Scenario: User views activity detail
- **WHEN** user clicks an activity card
- **THEN** the system displays full activity details including title, category, description, date, location, and image

### Requirement: Downloads with access control
The system SHALL display a downloads listing with: title, category tag, file size, download count. The listing SHALL support 9 category filters (協會表格/參考文獻/政府法令/研討會資料/公告附檔/活動簡章/CILT台灣分會/學員講師資料/其他), date range filtering, and keyword search. Files marked as members-only SHALL require authentication to download.

#### Scenario: Guest attempts members-only download
- **WHEN** a non-authenticated user clicks download on a members-only file
- **THEN** the system redirects to the login page with a return URL

#### Scenario: Member downloads a file
- **WHEN** an authenticated member clicks download
- **THEN** the file downloads and the download count increments by 1

### Requirement: Experience sharing articles
The system SHALL display experience sharing articles as cards with: author photo, name, title, company, CILT level, and summary. The listing SHALL support category filtering (企業/學生) and keyword search. Clicking a card SHALL expand to show full article content.

#### Scenario: User expands article
- **WHEN** user clicks an experience sharing card
- **THEN** the full article content expands inline or navigates to detail view

### Requirement: Content API endpoints
The system SHALL provide RESTful API endpoints for each content type:
- `GET /api/news` with query params: page, limit, category, keyword
- `GET /api/news/:id` for detail
- `GET /api/activities` with query params: page, limit, category, keyword, start_date, end_date
- `GET /api/activities/:id` for detail
- `GET /api/downloads` with query params: page, limit, category, keyword
- `GET /api/downloads/:id/file` (auth optional, required for members-only)
- `GET /api/columns` with query params: page, limit, category, keyword
- `GET /api/columns/:id` for detail
- `GET /api/exams` for exam listings

All listing endpoints SHALL return: `{ data: [...], total, page, totalPages }`.

#### Scenario: API returns paginated results
- **WHEN** client requests `GET /api/news?page=2&limit=10`
- **THEN** the API returns items 11-20 with correct total, page, and totalPages values

#### Scenario: API filters by category and keyword
- **WHEN** client requests `GET /api/activities?category=seminar&keyword=物流`
- **THEN** the API returns only seminar activities matching the keyword

### Requirement: Content admin CRUD
The system SHALL provide admin API endpoints for managing all content types (news, activities, downloads, columns):
- `POST /api/admin/<type>` to create (with image/file upload for downloads)
- `PUT /api/admin/<type>/:id` to update
- `DELETE /api/admin/<type>/:id` to soft-delete (set is_published=0)
All admin endpoints SHALL require admin role authentication.

#### Scenario: Admin creates a news item
- **WHEN** admin submits POST to `/api/admin/news` with title, category, content
- **THEN** the news item is created with is_published=1 and returns the created item

#### Scenario: Admin soft-deletes a download
- **WHEN** admin submits DELETE to `/api/admin/downloads/5`
- **THEN** the download's is_published is set to 0 (not permanently deleted) and it no longer appears in public listings
