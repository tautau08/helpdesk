# User Interface Description Document
## Helpdesk - Customer Care Ticketing System

### Project Overview
Helpdesk is a comprehensive role-based customer care service application of Reddot digital ltd enabling users to create and manage support tickets for bugs, errors, and service requests. The system features dynamic permission management, escalation matrix routing, and multi-entity relationship management across companies, projects, departments, and categories.

---

## Login Page (Initial Entry Point)

The login page serves as the first point of entry to the application. Users must authenticate before accessing any features. The page is split into two equal halves on desktop (50/50) and stacks vertically on mobile.

### Layout Structure

**Left Section (Form Area):**
- White background (#FFFFFF)
- Centered vertically and horizontally
- Maximum width: 450px with padding
- Company logo at top (use /logo from public folder)
- Form card with subtle shadow

**Right Section (Visual Area):**
- Display decorative image (use /loginImage from public folder)
- Image covers full height and width of right section
- Object-fit: cover to maintain aspect ratio
- On mobile, this section appears above the form with reduced height (40vh)

### Login Form Components

**Logo Section:**
- Company logo image (max width: 180px)
- Positioned at top-center of form area
- Margin bottom: 32px

**Welcome Text:**
- Heading: "Welcome to RedDot Helpdesk" (text-3xl, font-bold, text-gray-900)
- Subtext: "Sign in to manage your support tickets and requests" (text-sm, text-gray-600)
- Margin bottom: 32px

**Form Fields:**

1. **Username Field:**
   - Label: "Username *" (text-sm, font-medium, text-gray-700)
   - Input: Text type, placeholder "Enter your username"
   - Border: 1px solid #E5E7EB (gray-200)
   - Border radius: 8px
   - Padding: 12px 16px
   - Focus state: Border color #E63946 (primary red), ring-2 ring-primary
   - Error state: Border red-500, error message below in red

2. **Password Field:**
   - Label: "Password *" (text-sm, font-medium, text-gray-700)
   - Input: Password type, placeholder "Enter password"
   - Show/Hide password toggle icon on right side
   - Same styling as email field
   - Error state: Border red-500, error message below in red

**Additional Options (between password and button):**
- Checkbox: "Remember me" (small checkbox with text-sm label)
- Link: "Forgot your password ?" (text-primary, hover:underline, right-aligned)
- Flex layout: justify-between to space them apart

**Login Button:**
- Full width (w-full)
- Background: #E63946 (primary red)
- Text: "Log In" (white, font-medium, text-base)
- Padding: 12px 24px
- Border radius: 8px
- Hover: Background darken to #d32f3c
- Loading state: Shows "Logging in..." with spinner
- Margin top: 24px

**Social Login (Optional):**
- Divider text: "Or, Login with" (centered, text-sm, text-gray-500)
- Google sign-in button (optional, if implementing OAuth)
  - White background, border gray-300
  - Google icon on left
  - Text: "Sign up with google"

**Footer Section:**
- Text: "Don't have an account ?" followed by "Register here" link
- Centered, text-sm
- Link color: #E63946 (primary), hover:underline
- Margin top: 24px

### Responsive Behavior

**Desktop (≥1024px):**
- Two-column layout (50% form, 50% image)
- Form area centered with max-width constraint
- Image covers full right side height

**Tablet (768px - 1023px):**
- Two-column layout maintained
- Form area max-width: 400px
- Image section slightly compressed

**Mobile (<768px):**
- Single column layout
- Image section at top (height: 40vh, object-fit: cover)
- Form section below with full width
- Padding: 24px horizontal, 32px vertical
- Logo smaller (max-width: 140px)

### Authentication Flow

1. User enters username and password
2. Client-side validation:
   - Username required (minimum 3 characters)
   - Password minimum length (6 characters)
3. On submit, show loading state on button
4. API call to backend `/api/auth/login`
5. On success:
   - Store JWT token in localStorage
   - Store user data in context
   - Show success toast: "Login successful!"
   - Redirect to `/dashboard` after 1 second
6. On error:
   - Show error toast with message from API
   - Highlight error fields with red border
   - Enable form for retry

### Visual Design

**Colors:**
- Primary action color: #E63946 (RedDot brand red)
- Text primary: #111827 (gray-900)
- Text secondary: #6B7280 (gray-500)
- Border default: #E5E7EB (gray-200)
- Error: #EF4444 (red-500)
- Success: #10B981 (green-500)

**Typography (Poppins font):**
- Heading: 30px (text-3xl), font-bold (700)
- Subheading: 14px (text-sm), regular (400)
- Form labels: 14px (text-sm), font-medium (500)
- Input text: 15px (text-base), regular (400)
- Button text: 15px (text-base), font-medium (500)
- Footer text: 13px (text-xs or small text-sm), regular (400)

**Spacing:**
- Logo to heading: 32px
- Heading to subtext: 8px
- Subtext to form: 32px
- Between form fields: 20px
- Field to button: 24px
- Button to divider: 24px

**Shadows:**
- Form card: 0 1px 3px rgba(0,0,0,0.08)
- Button hover: 0 4px 12px rgba(230, 57, 70, 0.3)
- Input focus: 0 0 0 3px rgba(230, 57, 70, 0.1)

---

## Layout Structure

### Primary Navigation
The application uses a collapsible slim sidebar positioned on the left side of the screen. In collapsed state, the sidebar displays only icons with 48px width. On hover or click, it expands smoothly to reveal full menu labels at 240px width. The sidebar maintains fixed positioning, spans full viewport height, and features the Helpdesk logo at the top with Reddot Digital branding colors.

### Top Navigation Bar
A horizontal bar spans the full width at the top of the application with 64px height. The left section contains the Helpdesk wordmark logo. The center section provides context-aware breadcrumbs showing current location hierarchy. The right section houses user profile avatar with dropdown, notification bell icon with badge counter, and logout button. The bar uses a semi-transparent white background with subtle shadow for depth.

### Main Content Area
The content area occupies the remaining space to the right of the sidebar and below the top bar. Content is centered with maximum width of 1400px on large screens and includes 24px padding on desktop, 16px on mobile. The area features smooth fade and slide transitions (300ms duration) when switching between views. Background uses the soft gradient from light pink to light blue matching the portfolio aesthetic.

### Floating Action Button
A circular button (56px diameter) positioned in bottom-right corner (24px from edges) provides quick access to ticket creation from any view. The button uses the primary red color (#E91E63 or similar from Red&Digital branding) with white plus icon, elevated shadow, and subtle pulse animation on hover. Button remains fixed during scroll and includes tooltip "Create Ticket" on hover.

---

## Core Components

### Sidebar Menu
Menu items display differently based on user role with smooth expand/collapse animation. Each item shows icon (24px) and label when expanded. Active items highlighted with gradient background accent and left border indicator in brand red color.

**System/Admin View:**
- Dashboard (home icon)
- All Tickets (ticket/clipboard icon)
- Users Management (users icon)
- Roles Management (shield icon)
- Companies (building icon)
- Projects (folder icon)
- Departments (sitemap icon)
- Categories (tag icon)
- Subcategories (tags icon)
- Status Management (circle icon)
- Priorities (flag icon)
- Service Types (wrench icon)
- Escalation Matrix (route icon)
- Settings (gear icon)

**Employee View:**
- Dashboard (home icon)
- All Tickets (ticket icon)
- My Tickets (user-check icon)
- Create Ticket (plus icon)
- Companies (building icon)
- Projects (folder icon)
- Categories (tag icon)
- Subcategories (tags icon)

**User/Client View:**
- Dashboard (home icon)
- My Tickets (ticket icon)
- Create Ticket (plus icon)

### Dashboard Widgets
Dashboard displays summary cards in responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile). Each card features gradient background (subtle pink to blue), icon representing metric, large number display, descriptive label, and optional sparkline graph showing trend.

**User Dashboard:**
- Total My Tickets (all tickets created by user)
- Open Tickets (current active tickets)
- In Progress Tickets (being worked on)
- Resolved Tickets (completed tickets)

**Employee Dashboard:**
- Total Tickets System-wide
- Tickets Assigned to Me
- Open Tickets
- In Progress Tickets
- Resolved Today
- Pending Customer Response

**Admin Dashboard:**
- Total Tickets
- Total Active Users
- Total Companies
- Total Active Roles
- Tickets Resolved This Week
- Average Resolution Time
- System Health Status

Below dashboard cards, Recent Activity section shows last 10 tickets in compact list format with ticket ID, title, status badge, and time ago timestamp.

### Ticket List View
Primary landing page displays tickets in clean card-based list format. Each ticket card shows:
- Ticket ID badge (top-left, small gray badge)
- Title (bold, 16px font)
- Description preview (2 lines maximum, fade ellipsis)
- Company name (small text with building icon)
- Category and Subcategory badges (colored pills)
- Current status badge (colored with icon: New/Open/In Progress/Resolved/Closed)
- Priority indicator (colored dot or flag: Low/Medium/High)
- Service Type (Incident/Service Request/Change Request)
- Created by user name with avatar thumbnail
- Created date (relative time: "2 hours ago" or absolute date)
- Last updated timestamp

Cards have white background with subtle shadow, rounded corners (8px), and hover effects with elevated shadow and slight scale transform. Status badges use semantic colors: Open (blue), In Progress (amber), Resolved (green), Closed (gray).

Top of list view contains:
- Search bar (full width, placeholder "Search by ticket ID, title, description, or company")
- Filter section with tabs: All, Open, In Progress, Resolved, Closed, My Tickets
- Advanced filters dropdown revealing: Company, Project, Category, Subcategory, Priority, Service Type, Date Range, Created By
- Sort dropdown (top-right): Newest First, Oldest First, Priority High to Low, Last Updated, Status
- View toggle: Card view or Table view

Pagination shows at bottom: entries per page selector (10/20/50/100), current page info, and page navigation buttons.

### Ticket Creation Form
Form appears as slide-in panel from right side (60% width on desktop, full screen on mobile) or expands inline at top of ticket list. Panel has white background with gradient header matching brand colors.

Form fields organized in logical sections:

**Basic Information:**
- Title (text input, required, max 150 chars, real-time character counter)
- Description (rich text editor with formatting toolbar, required, supports markdown)

**Categorization (with cascading dropdowns):**
- Company (dropdown, required, loads projects on selection)
- Project (dropdown, optional, loads categories on selection)
- Category (dropdown, required, loads subcategories on selection)
- Subcategory (dropdown, required, displays response/resolution time info)

**Classification:**
- Service Type (radio buttons with icons: Incident, Service Request, Change Request, Problem)
- Priority (pill button group: Low, Medium, High, Critical with color coding)
- Initial Status (auto-set to "New" or "Open", displays as read-only with explanation)

**Additional Details:**
- File Attachments (drag-and-drop zone, supports multiple files, shows file list with remove option, file type validation, max 10MB per file)
- Tags (input with autocomplete, create custom tags)

**SLA Information Display (read-only, based on selected subcategory):**
- Expected Response Time (e.g., "30 minutes")
- Expected Resolution Time (e.g., "2 hours")
- Customer Response Required badge (yes/no)

Form footer contains:
- Cancel button (secondary, ghost style)
- Save as Draft button (secondary, outlined)
- Create Ticket button (primary, gradient background matching brand)

Real-time validation shows error states with red borders and error messages below fields. Success states briefly show green borders.

### Ticket Detail Panel
When ticket selected from list, detail panel slides in from right side overlaying 60% screen width on desktop, full screen on mobile. Panel header shows:
- Ticket ID as large badge
- Current status badge with icon
- Priority flag
- Close button (X icon)
- Action dropdown menu (three dots) with options based on role

Panel content organized in tabs:
- **Details Tab** (default): Full information display
- **History Tab**: Timeline of status changes, assignments, updates
- **Comments Tab**: Threaded discussion (if implemented later)
- **Attachments Tab**: All uploaded files with preview

**Details Tab Content:**
- Title (editable inline for authorized users, pencil icon on hover)
- Full description with preserved formatting and line breaks
- Metadata grid:
  - Company name (clickable link to company view)
  - Project name (clickable link)
  - Category and Subcategory (badges)
  - Service Type (badge with icon)
  - Priority (colored badge)
  - Created by (user avatar, name, timestamp)
  - Last updated by (user name, timestamp)
  - Submitted Status (immutable, gray badge)
  - Current Status (colored badge with dropdown to change for authorized users)

**SLA Tracking Section:**
- Response Time: Progress bar showing time elapsed vs expected
- Resolution Time: Progress bar showing time elapsed vs expected
- Status indicators: On Time (green), At Risk (amber), Overdue (red)
- Customer Response Required indicator

**Escalation Information (Admin/Employee only):**
- Current escalation level
- Next escalation in X minutes
- Escalation recipients list

**Attachments Display:**
- File cards showing icon, filename, size, uploaded by, timestamp
- Download button for each file
- Preview option for images and PDFs

**Action Buttons (role-based):**
- Edit Ticket (primary button, authorized users)
- Change Status (dropdown, authorized users)
- Assign to User (dropdown search, employees/admins)
- Close Ticket (secondary button)
- Reopen Ticket (if closed)
- Delete Ticket (danger button, admin only, confirmation required)
- Print Ticket (utility button)

On mobile, detail panel slides up from bottom, includes back arrow in header for easy return to list.

### User Management Interface (Admin Only)

**List View:**
Data table with columns:
- Avatar (circular, 32px)
- Name (sortable, clickable to detail)
- Username (sortable)
- Email (truncated if long)
- Company (badge)
- Project (badge or "-")
- Department (badge)
- Role (colored badge)
- Status (Active/Inactive toggle switch)
- Actions (icon buttons: Edit, View, Deactivate/Activate, Delete)

Table includes:
- Multi-select checkboxes for bulk actions
- Column visibility toggle
- Export button (CSV, Excel)
- Pagination controls

Top section contains:
- Create User button (primary, with plus icon)
- Search input (searches name, username, email)
- Filter dropdowns: Company, Role, Department, Status
- Bulk action dropdown (for selected users): Activate, Deactivate, Export

**User Detail/Edit Panel:**
Slide-in panel from right with tabs:

**Profile Tab:**
- Avatar upload (circular crop, 150x150px)
- Name (text input, required)
- Username (text input, required, unique validation)
- Email (email input, validation)
- Password (password input, show/hide toggle, strength indicator)
- Confirm Password (matches validation)

**Organization Tab:**
- Company (dropdown with search, required)
- Project (dropdown, optional, filtered by selected company)
- Department (dropdown, required)
- Sort Order (number input, for display ordering)

**Access Tab:**
- Role assignment (dropdown showing role name and description)
- Permission preview (read-only list showing what permissions this role grants)
- Active Status (toggle switch with explanation)

**Activity Tab (view only):**
- Tickets created count
- Last login timestamp
- Account created date
- Last updated by and when

Form footer: Cancel, Save buttons with loading state during submission.

### Role Management Interface (Admin Only)

**Role List View:**
Expandable card layout showing:
- Role name (large, bold)
- Description (2 lines preview)
- User count badge (showing how many users have this role)
- Active status indicator
- Expand/collapse arrow

When expanded, card reveals:

**Permission Matrix:**
Organized by entity category with visual hierarchy:

**Ticket Permissions:**
- View All Tickets (checkbox)
- View Own Tickets (checkbox)
- Create Tickets (checkbox)
- Edit Own Tickets (checkbox)
- Edit All Tickets (checkbox)
- Delete Own Tickets (checkbox)
- Delete All Tickets (checkbox)
- Change Ticket Status (checkbox)
- Assign Tickets (checkbox)

**User Management Permissions:**
- View Users (checkbox)
- Create Users (checkbox)
- Edit Users (checkbox)
- Activate/Deactivate Users (checkbox)
- Delete Users (checkbox)

**Role Management Permissions:**
- View Roles (checkbox)
- Create Roles (checkbox)
- Edit Roles (checkbox)
- Delete Roles (checkbox)
- Assign Permissions (checkbox)

**Company Management Permissions:**
- View Companies (checkbox)
- Create Companies (checkbox)
- Edit Companies (checkbox)
- Delete Companies (checkbox)

**Project Management Permissions:**
- View Projects (checkbox)
- Create Projects (checkbox)
- Edit Projects (checkbox)
- Delete Projects (checkbox)

**Category Management Permissions:**
- View Categories (checkbox)
- Create Categories (checkbox)
- Edit Categories (checkbox)
- Delete Categories (checkbox)

**Similar patterns for:**
- Department Permissions
- Subcategory Permissions
- Status Permissions
- Priority Permissions
- Service Type Permissions
- Escalation Matrix Permissions

Each permission shows clear label, description tooltip on hover, and visual checkbox with smooth animation.

**Create/Edit Role Modal:**
Modal dialog (600px width, centered) contains:
- Role Name (text input, required)
- Description (textarea, 3 rows)
- Permission selection (same matrix as expanded view)
- Active status toggle
- Save and Cancel buttons

Top of page shows:
- Create Role button (primary)
- Search roles input
- Filter by: Active Status, Permission Type

### Company Management Interface (Admin Only)

**List View:**
Card grid layout (3 columns desktop, 2 tablet, 1 mobile) showing:
- Company name (large, bold)
- Number of projects badge
- Number of users badge
- Created date
- Active status indicator
- Quick actions: Edit, View Projects, View Users, Activate/Deactivate, Delete

Top section:
- Create Company button
- Search companies input
- Filter: Active/Inactive/All
- Sort: Name A-Z, Name Z-A, Newest, Oldest

**Company Detail/Edit Panel:**
Slide-in panel with tabs:

**Details Tab:**
- Company Name (text input, required, max 150 chars)
- Sort Order (number input)
- Active Status (toggle)
- Created info (read-only)
- Updated info (read-only)

**Projects Tab:**
- List of all projects under this company
- Create Project button (quick create)
- Project cards with name, user count, status

**Users Tab:**
- List of all users in this company
- User table (simplified view)
- Create User button

**Statistics Tab:**
- Total tickets from this company
- Open tickets count
- Average resolution time
- Most common issue categories

### Project Management Interface (Admin/Employee)

Similar structure to Company Management with:
- Project cards showing: Name, Company badge, Category count, User count
- Create Project form with: Name, Company selection, Sort Order, Active Status
- Project detail showing: Associated categories, Users, Ticket statistics

### Department Management Interface (Admin Only)

List view with department cards showing:
- Department name
- User count
- Active status
- Edit and Delete actions

Create/Edit form:
- Department Name (required)
- Sort Order
- Active Status

### Category Management Interface (Admin/Employee)

Hierarchical tree view showing:
- Project name (expandable)
  - Categories (expandable)
    - Subcategories (with response/resolution times)

Each category card shows:
- Category name
- Project it belongs to
- Subcategory count
- Ticket count using this category
- Edit, Delete actions

Create/Edit Category form:
- Category Name (required)
- Project (dropdown, required)
- Sort Order
- Active Status

### Subcategory Management Interface (Admin/Employee)

Detailed list showing:
- Subcategory name
- Parent category badge
- Response Time (minutes, with clock icon)
- Resolution Time (minutes, with timer icon)
- Customer Response Required badge (yes/no)
- Active status
- Escalation matrix indicator (configured/not configured)
- Actions

Create/Edit Subcategory form:
- Name (required)
- Category (dropdown, required, loads based on selected project)
- Response Time (number input, minutes)
- Resolution Time (number input, minutes)
- Customer Response Required (toggle)
- Sort Order
- Active Status

Information tooltip explaining: Response time is when first contact should be made, Resolution time is when issue should be solved.

### Status Management Interface (Admin Only)

Simple list view with status badges showing:
- Status name (displayed as badge in actual status color)
- Sort Order (determines status progression)
- Active status
- Ticket count using this status
- Edit, Delete actions

Create/Edit form:
- Status Name (required)
- Sort Order (determines workflow order)
- Active Status
- Color selection (for badge display)

Common statuses: New, Open, In Progress, Pending Customer, Pending Internal, Resolved, Closed, Cancelled.

### Priority Management Interface (Admin Only)

List showing priority levels with visual indicators:
- Priority name
- Visual indicator (colored dot/flag)
- Sort Order (determines escalation hierarchy)
- Active status
- Ticket count
- Actions

Create/Edit form:
- Priority Name (required)
- Color selection (for visual coding)
- Sort Order
- Active Status

Common priorities: Low, Medium, High, Critical/Urgent.

### Service Type Management Interface (Admin Only)

Card view showing:
- Service Type name
- Icon representation
- Description
- Ticket count
- Active status
- Actions

Create/Edit form:
- Service Type Name (required)
- Description (textarea)
- Icon selection (from icon library)
- Sort Order
- Active Status

Common types: Incident, Service Request, Change Request, Problem.

### Escalation Matrix Management Interface (Admin/Employee)

Complex interface for configuring escalation rules per subcategory:

**Selection View:**
- Subcategory selector (dropdown)
- Type toggle (PRE-escalation / POST-escalation tabs)

**PRE-escalation View:**
Timeline visualization showing escalation levels before resolution time expires:
- Time range bars (visual timeline from 0 to resolution time)
- Each escalation level card shows:
  - Time range (from X to Y minutes)
  - Email recipient(s) (input with email validation)
  - Add/Remove buttons
  - Order controls (move up/down)

**POST-escalation View:**
Similar timeline for after resolution time expires:
- Time ranges continue from resolution time onward
- Same escalation level structure

**Create/Edit Escalation Rule:**
Form within card:
- Subcategory (dropdown, filtered by category)
- Escalation Type (radio: PRE or POST)
- From Time (number input, minutes)
- To Time (number input, minutes)
- Email Address (email input, can add multiple, tag-style input)
- Sort Order
- Active Status

Visual helper shows:
- Subcategory response time
- Subcategory resolution time
- Coverage gaps warning (if time ranges don't cover all scenarios)
- Overlap warning (if time ranges conflict)

Add Level button allows creating multiple escalation tiers.

Example display:
```
Subcategory: Email Access Issues
Response Time: 30 min | Resolution Time: 120 min

PRE-ESCALATION (before 120 min):
[====== 0-30 min ======] → support-l1@company.com
[====== 30-60 min =====] → support-l2@company.com, manager@company.com
[====== 60-120 min ====] → senior-support@company.com, director@company.com

POST-ESCALATION (after 120 min):
[==== 120-180 min ====] → escalation@company.com, vp@company.com
[==== 180+ min ========] → executive@company.com
```

### Settings Interface (Admin Only)

Tabbed interface:

**General Settings:**
- Application name
- Support email
- Time zone
- Date format preference
- Language selection

**Notification Settings:**
- Email notifications on ticket creation
- Email notifications on status change
- Email escalation settings
- Notification templates (view/edit)

**Security Settings:**
- JWT token expiration time
- Password requirements configuration
- Session timeout
- IP whitelist/blacklist

**System Information:**
- Version number
- Last updated
- Database statistics
- System health check

### Modal Dialogs
Modals appear centered with semi-transparent dark backdrop (rgba(0,0,0,0.5)). Modal has white background, subtle shadow, rounded corners (12px). Structure includes:

**Header Section:**
- Title (18px, semibold)
- Close button (X icon, top-right)

**Body Section:**
- Form fields or content
- Scrollable if content exceeds viewport

**Footer Section:**
- Left-aligned help text or secondary info (optional)
- Right-aligned action buttons: Cancel (secondary, ghost), Confirm (primary)

**Confirmation Modals** for destructive actions (delete):
- Warning icon (red)
- Clear warning message
- Consequences explanation
- "Type DELETE to confirm" input for critical actions
- Cancel and Delete buttons (delete button in danger red)

**Success Modals:**
- Success icon (green checkmark)
- Confirmation message
- Next steps or suggestions
- OK button

---

## Interaction Patterns

### Navigation Behavior
Clicking sidebar menu items smoothly transitions main content without full page reload. Fade and slide animation (300ms) occurs with content sliding in from right. Active route highlighted with gradient background in sidebar and reflected in breadcrumbs showing full path (e.g., "Home > Tickets > Ticket #123").

Browser back/forward buttons work correctly with proper route history management.

### List Interactions
Clicking ticket card opens detail panel sliding from right. Hover state shows elevated shadow, subtle background color change, and scale transform (1.02). On mobile, tap shows instant visual feedback with ripple effect.

Long-press on mobile ticket card shows context menu with quick actions: View, Edit, Change Status, Delete.

Multi-select mode activated by clicking checkbox on first item, reveals bulk action bar at bottom with: Select All, Deselect All, and action dropdown.

### Form Validation
Fields validate on blur (when user leaves field) and on form submission attempt. Error states display:
- Red border on input field
- Error icon within field (right side)
- Error message below field in red text (14px)
- Field label turns red

Success states briefly show:
- Green border
- Checkmark icon
- Success message if important

Required fields marked with red asterisk next to label. Optional fields show (optional) in gray text.

Real-time validation for:
- Email format
- Username availability (debounced API check after 500ms)
- Password strength (meter shows weak/fair/good/strong)
- Character count (shows remaining characters)

### Cascading Dropdowns
When user selects Company, Project dropdown enables and loads projects for that company. When Project selected, Category dropdown enables. When Category selected, Subcategory dropdown enables. Each dropdown shows loading spinner while fetching data.

Selected values show breadcrumb trail above dropdowns: Company > Project > Category > Subcategory for easy reference.

### Loading States
During data fetching, skeleton loaders appear matching expected content shape:
- List views: 5-7 skeleton cards with animated shimmer effect
- Detail panels: Skeleton text lines of varying widths
- Tables: Skeleton rows with column structure
- Forms: Skeleton input fields

Page-level loading shows thin animated progress bar across top of screen (indeterminate style, brand colored).

Button loading states replace button text with spinner, disable button, show "Loading..." or "Saving..." text.

### Toast Notifications
Notifications slide in from bottom-right corner (300ms animation), positioned above floating action button. Each toast shows:
- Icon indicating type (checkmark/exclamation/info/error)
- Title (bold, 14px)
- Message (regular, 13px)
- Close button
- Color-coded left border

Toast types:
- Success: Green, checkmark icon, "Success!" title
- Error: Red, X icon, "Error" title
- Warning: Amber, exclamation icon, "Warning" title
- Info: Blue, info icon, "Info" title

Toasts auto-dismiss after 4 seconds with fade-out animation, or user can manually close. Multiple toasts stack vertically with 8px gap, newest appears at bottom. Maximum 3 visible toasts, older ones removed.



### Search Functionality
Search input with magnifying glass icon shows dropdown results as user types (debounced 300ms). Dropdown shows:
- Recent searches (if available)
- Quick results (top 5 matches)
- "View all results" link

Search results highlight matching text. Search works across multiple fields (ID, title, description) and shows which field matched.

Advanced search panel expands below search bar with additional filters organized in collapsible sections.

### Empty States
When no data exists, centered empty state displays:
- Illustration (friendly, on-brand graphics from portfolio style)
- Heading explaining empty state ("No tickets yet")
- Descriptive text ("Create your first ticket to get started")
- Primary action button ("Create Ticket")
- Optional secondary text with link ("Learn how tickets work")

Empty state for filtered results shows different message: "No tickets match your filters" with "Clear filters" button.

### Infinite Scroll vs Pagination
Mobile ticket lists use infinite scroll for fluid experience. As user scrolls to bottom, loading indicator appears and next page loads automatically. "Back to top" button appears when user scrolls past first page.

Desktop shows "Load More" button after initial 20 tickets, revealing next page when clicked. User and role management tables use traditional pagination with page numbers, previous/next buttons, and page size selector.

### Drag and Drop
File upload areas support drag and drop:
- Drag over shows highlighted border (dashed, brand colored)
- Drop zone message changes to "Drop files here"
- Multiple files supported, shows count during drag
- Invalid file types show error on drop

### Dropdown Menus
Dropdowns open below trigger element (or above if insufficient space below). Smooth fade and scale animation (200ms). Clicking outside closes dropdown. Arrow keys navigate options, Enter selects, Esc closes.

Searchable dropdowns (for large option sets like companies, users) include search input at top. Search filters options in real-time. No match shows "No results found" message.

Multi-select dropdowns show selected items as removable chips below dropdown, with count badge on dropdown trigger.

### Status Change Workflow
When authorized user changes ticket status:
1. Dropdown shows available status transitions (not all statuses shown, only valid next states)
2. Selection opens confirmation modal (for critical changes like "Closed")
3. Modal includes optional comment field ("Reason for status change")
4. On confirm, status updates with loading state
5. Success toast appears
6. Ticket detail refreshes showing new status
7. History tab gains new entry with timestamp, user, old status, new status, comment

### Tooltips and Help Text
Hover over info icon (ⓘ) shows tooltip with explanation (appears after 500ms delay). Tooltips have dark background (rgba(0,0,0,0.9)), white text, rounded corners, arrow pointing to trigger element.

Form fields with complex requirements show help text below input (in gray) explaining format or constraints.

### Responsive Touch Targets
All interactive elements have minimum 44x44px touch target on mobile. Buttons show active state on touch (darker shade) with instant feedback. No hover states on touch devices, only tap states.

Swipe gestures:
- Swipe left on ticket card reveals delete action (red)
- Swipe right on panel closes it
- Pull to refresh on lists (mobile)

---

## Visual Design Elements & Color Scheme

### Brand Color Palette (from Red&Digital Portfolio)

**Primary Colors:**
- Brand Red/Pink: #df004aff or #FF1744 (primary actions, accents, active states)
- Secondary Blue: #2196F3 or #448AFF (links, info elements, secondary emphasis)

**Background Gradient:**
Soft pastel gradient matching portfolio:
- Start: rgba(247, 188, 228, 1) - Light pink
- Middle: rgba(240, 245, 255, 1) - Light blue
- End: rgba(222, 237, 247, 1) - Very light blue
- Direction: 135deg diagonal or top-to-bottom

**Neutral Palette:**
- Pure White: #FFFFFF (cards, panels, modals)
- Off-White Background: #FAFBFC (subtle background variation)
- Light Gray Border: #E8EAED (card borders, dividers)
- Medium Gray: #9AA0A6 (secondary text, icons)
- Dark Gray Text: #202124 (primary text, headings)
- Black: #000000 (used sparingly for high contrast)

**Status Colors (Semantic):**
- Success Green: #00C853 (resolved tickets, success states)
- Warning Amber: #FFB300 (in progress, at risk, warnings)
- Error Red: #D32F2F (high priority, errors, destructive actions)
- Info Blue: #1976D2 (new tickets, information)
- Pending Purple: #9C27B0 (pending states)

**Priority Colors:**
- Low: #4CAF50 (green)
- Medium: #FF9800 (orange)
- High: #F44336 (red)
- Critical: #C62828 (dark red)

**Semantic Usage:**

**Buttons:**
- Primary: Gradient from #E91E63 to #FF1744, white text, shadow elevation
- Secondary: White background, border with brand color, brand colored text
- Ghost: Transparent background, brand colored text, no border
- Danger: #D32F2F background, white text
- Hover states: Darken by 10%, slight scale (1.02)
- Disabled: #E0E0E0 background, #9E9E9E text

**Links:**
- Default: #2196F3 (blue)
- Hover: Underline appears, color darkens to #1976D2
- Visited: #6A1B9A (purple, optional)

**Status Badges:**
- Pill-shaped with rounded corners (16px border-radius)
- Soft colored backgrounds (opacity 0.1-0.15) with darker text
- Example: Open tickets use #E3F2FD background with #1976D2 text
- Small dot indicator before text matching badge color

**Cards:**
- White background (#FFFFFF)
- Subtle shadow: 0 1px 3px rgba(0,0,0,0.08)
- Border: 1px solid #E8EAED
- Hover: Shadow increases to 0 4px 12px rgba(0,0,0,0.12)

### Spacing System
Consistent 8px-based spacing scale:
- xs: 4px (tight spacing)
- sm: 8px (close elements)
- md: 16px (standard spacing)
- lg: 24px (section spacing)
- xl: 32px (major sections)
- 2xl: 48px (page-level spacing)
- 3xl: 64px (hero sections)

### Elevation & Shadows

**Shadow Levels:**
- Level 1 (Resting cards): 0 1px 3px rgba(0,0,0,0.08)
- Level 2 (Hover cards): 0 4px 12px rgba(0,0,0,0.12)
- Level 3 (Dropdowns): 0 8px 16px rgba(0,0,0,0.15)
- Level 4 (Modals): 0 16px 32px rgba(0,0,0,0.2)
- Level 5 (Floating button): 0 8px 24px rgba(233,30,99,0.3) - colored shadow with brand color

### Border Radius
- Small elements (badges, chips): 4px
- Buttons: 6px
- Input fields: 6px
- Cards: 8px
- Panels: 12px (right side only for slide-in panels)
- Modals: 16px
- Avatars: 50% (circular)
- Floating action button: 50% (circular)

### Icons
Use Lucide React or Heroicons for consistency. Icon specifications:
- Small inline: 16px (next to text)
- Medium buttons: 20px (button icons