## ADDED Requirements

### Requirement: CILT brand color system
The system SHALL use the following CSS custom properties as the color system:
- Primary: `--royal-blue: #003366` (main brand color)
- Dark: `--navy-dark: #001a33` (navigation, footer)
- Accent: `--gold: #c8a951` (certification highlights, CTAs)
- Accent hover: `--gold-light: #d4b96a`
- Background: `--white: #ffffff`, `--gray-50: #f8f9fb`, `--gray-100: #f1f3f7`, `--gray-200: #e2e8f0`
- Text: `--text-dark: #1a2236`, `--text-body: #4a5568`, `--text-light: #94a3b8`
- Semantic: `--success: #10b981`, `--warning: #f59e0b`, `--danger: #ef4444`

#### Scenario: Color consistency across pages
- **WHEN** any page loads
- **THEN** all UI elements use colors defined in the CSS custom properties, with royal blue as primary and gold as accent

### Requirement: Typography system
The system SHALL use Noto Sans TC (Google Fonts) for Chinese text and Playfair Display for English display headings. Font weights: headings 700-900, body 400, auxiliary 300. Font sizes SHALL follow a consistent hierarchy from display (2.5rem) to caption (0.75rem).

#### Scenario: Font loading
- **WHEN** any page loads
- **THEN** Noto Sans TC and Playfair Display are loaded from Google Fonts CDN

### Requirement: Responsive design with 3 breakpoints
The system SHALL implement responsive design with breakpoints: Desktop (>1100px, 3-4 columns), Tablet (768-1100px, 2 columns), Mobile (<768px, 1 column). Navigation SHALL collapse to hamburger menu on mobile. All content SHALL be readable and functional across all breakpoints.

#### Scenario: Mobile layout
- **WHEN** viewport width is less than 768px
- **THEN** content displays in single column, navigation uses hamburger menu, cards stack vertically, and all interactive elements are touch-friendly (min 44px tap targets)

#### Scenario: Tablet layout
- **WHEN** viewport width is between 768px and 1100px
- **THEN** content displays in 2-column grid where applicable, navigation remains horizontal

### Requirement: Component specifications
The system SHALL implement shared UI components with consistent styling:
- Cards: 12px border-radius, subtle shadow, hover translateY(-2px) animation
- Buttons: 8px border-radius, primary (royal-blue bg), secondary (gold bg), outline variants
- Input fields: 8px border-radius, gold border on focus
- Navigation bar: glassmorphism effect (backdrop-blur 12px), fixed position
- Modals: 16px border-radius, overlay backdrop, fadeIn animation
- Tags/badges: pill shape for category labels

#### Scenario: Card hover interaction
- **WHEN** user hovers over a card component
- **THEN** the card lifts with translateY(-2px) and shadow intensifies with smooth transition

### Requirement: Certification level visual indicators
The system SHALL use distinct visual treatments for each CILT certification level:
- Level 1 (Foundation): Bronze accent (#CD7F32)
- Level 2 (Supervisory): Silver accent (#C0C0C0)
- Level 3 (Operational): Gold accent (#c8a951)
- Level 4 (Strategic): Platinum accent (#E5E4E2)
These SHALL appear on certification cards, member profiles, and experience sharing articles.

#### Scenario: Level badge display
- **WHEN** a certification level is displayed (card, profile, or article)
- **THEN** the appropriate level color accent and badge icon are used

### Requirement: Print-friendly styles
The system SHALL include print-friendly CSS that hides navigation, footer, and interactive elements, and optimizes content layout for A4 paper size. This is particularly important for certification information and exam details pages.

#### Scenario: User prints certification page
- **WHEN** user triggers print on the certification levels page
- **THEN** navigation and footer are hidden, content is reformatted for A4, and certification level cards print cleanly
