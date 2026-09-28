# Campus Event Pulse

Campus Event Pulse is a modern, responsive, production-quality college campus event platform built with React, Vite, Tailwind CSS, and Supabase. The platform provides two distinct, role-based workflows for Students and Organizers to discover, register, manage, and coordinate campus activities in real-time.

---

## 🎯 Features

### For Students
- **Event Discovery (`/events`)**: Browse all published campus events in responsive cards with real-time seat availability.
- **Categorical & Date Filtering**: Filter events by category (*Technical, Cultural, Sports, Workshop, Seminar, Club, Other*) and date timelines (*Today, This Week, Upcoming, or Custom Date*).
- **Search & Live Filtering**: Instant search across titles, descriptions, and campus venues with zero-delay updates.
- **Event Details & Registration (`/events/:id`)**: View comprehensive event logistics, organizer information, seat capacities, and register with a single click.
- **Duplicate & Capacity Protection**: Prevents duplicate registrations and blocks registration on full or closed events.
- **Registration Management (`/my-registrations`)**: View active and past registrations with immediate cancellation and seat restoration.
- **Student Dashboard (`/student/dashboard`)**: Personalized view of upcoming events, events happening today, and quick discovery links.

### For Organizers
- **Organizer Dashboard (`/organizer/dashboard`)**: Comprehensive stats overview tracking *Total Events, Draft Events, Published Events, Closed Events,* and *Total Registrations*.
- **Event Lifecycle Management (`/organizer/events`)**: Manage drafts, publish events for student discovery, and close events when concluded.
- **Event Creation (`/organizer/events/new`)**: Form validation for Title, Description, Category, Date, Time, Venue, and Seat Limit. Events are created as `Draft`.
- **Event Modification (`/organizer/events/:id/edit`)**: Modify event information and sync updates to PostgreSQL.
- **Participant Roster (`/organizer/events/:id/participants`)**: View student attendee names, emails, registration timestamps, and seat statistics.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Backend Client**: Supabase JavaScript Client (`@supabase/supabase-js`)
- **Backend Architecture**: PostgreSQL with Row-Level Security (RLS) and Stored RPC Functions

---

## 📁 Project Structure

```
campus-event-pulse/
├── public/
│   └── vite.svg                  # Campus pulse brand icon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx         # Status & category badge indicators
│   │   │   ├── Button.jsx        # Accessible buttons with loading spinners
│   │   │   ├── Card.jsx          # Card system containers
│   │   │   ├── ConfirmDialog.jsx # Confirmation modals for critical actions
│   │   │   ├── EmptyState.jsx    # User-friendly empty states
│   │   │   ├── Footer.jsx        # Campus platform footer
│   │   │   ├── Modal.jsx         # Accessible backdrop modal dialogs
│   │   │   ├── Navbar.jsx        # Responsive navigation with mobile drawer
│   │   │   └── Skeleton.jsx      # Shimmer loading states
│   │   ├── events/
│   │   │   ├── EventCard.jsx     # Event card with seat tracking
│   │   │   └── EventFilters.jsx  # Category, date, and search filter panel
│   │   ├── organizer/
│   │   │   ├── EventTable.jsx    # Responsive event table & mobile card view
│   │   │   └── StatsCard.jsx     # Metric cards for organizer dashboard
│   │   └── routing/
│   │       ├── ProtectedRoute.jsx# Auth route guard
│   │       └── RoleRoute.jsx     # Role-based route guard (Student vs Organizer)
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state & session persistence
│   │   └── ToastContext.jsx      # Feedback alerts & toast notifications
│   ├── hooks/
│   │   ├── useAuth.js            # Auth hook
│   │   └── useToast.js           # Toast notification hook
│   ├── layouts/
│   │   ├── AuthLayout.jsx        # Auth container layout
│   │   ├── DashboardLayout.jsx   # Portal layout
│   │   └── MainLayout.jsx        # Main application layout
│   ├── lib/
│   │   └── supabaseClient.js     # Supabase client initialization
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx     # Supabase Auth login with demo fill
│   │   │   └── RegisterPage.jsx  # Student & Organizer account registration
│   │   ├── events/
│   │   │   ├── EventDetailsPage.jsx# Single event view with registration actions
│   │   │   └── EventsPage.jsx    # Discovery page with filters
│   │   ├── organizer/
│   │   │   ├── CreateEventPage.jsx # Event creation form
│   │   │   ├── EditEventPage.jsx   # Event editing form
│   │   │   ├── EventParticipantsPage.jsx # Participant roster & attendance
│   │   │   ├── OrganizerDashboard.jsx    # Analytics dashboard
│   │   │   └── OrganizerEventsPage.jsx   # Event management list
│   │   ├── student/
│   │   │   ├── MyRegistrationsPage.jsx # Student registration roster
│   │   │   └── StudentDashboard.jsx    # Student personal portal
│   │   ├── LandingPage.jsx       # Public landing page
│   │   ├── NotFoundPage.jsx      # 404 handler
│   │   └── ProfilePage.jsx       # User profile details
│   ├── services/
│   │   ├── authService.js        # Supabase Auth & profile wrappers
│   │   ├── eventService.js       # PostgreSQL RPC wrapper for events
│   │   ├── organizerService.js   # PostgreSQL RPC wrapper for organizer ops
│   │   └── registrationService.js# PostgreSQL RPC wrapper for registrations
│   ├── styles/
│   │   └── index.css             # Tailwind base styles & custom directives
│   ├── utils/
│   │   ├── errorHandler.js       # User-friendly error message mapping
│   │   ├── formatters.js         # Date, time, and badge format utilities
│   │   └── mockData.js           # Initial fallback data for evaluation demos
│   ├── App.jsx                   # Central route declarations
│   └── main.jsx                  # React application entry point
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file (protects .env and build output)
├── index.html                    # SEO metadata and Google font preconnects
├── package.json                  # Dependencies and build scripts
├── postcss.config.js             # PostCSS Tailwind config
├── tailwind.config.js            # Tailwind theme tokens & campus colors
├── vite.config.js                # Vite build and development configuration
└── README.md
```

---

## ⚡ Installation & Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

> **Note**: Never commit your real `.env` file to version control. The repository's `.gitignore` explicitly prevents `.env` from being pushed.

### 3. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🔗 Existing Supabase Backend Contract

This frontend is designed to consume an existing Campus Event Pulse Supabase/PostgreSQL backend providing:

### PostgreSQL RPC Functions Called
- `get_published_events`: Fetches all events with status `Published`.
- `get_event_details(p_event_id)`: Fetches event details and seat counts.
- `create_event(p_title, p_description, p_category, p_date, p_time, p_venue, p_seat_limit)`: Creates draft event.
- `update_event(p_event_id, p_title, p_description, p_category, p_date, p_time, p_venue, p_seat_limit)`: Updates existing event.
- `publish_event(p_event_id)`: Changes event status to `Published`.
- `close_event(p_event_id)`: Changes event status to `Closed`.
- `register_for_event(p_event_id)`: Registers authenticated student for an event.
- `cancel_registration(p_event_id)`: Cancels student's registration and restores available seat.
- `get_my_registrations()`: Retrieves registrations of the logged-in student.
- `get_organizer_dashboard()`: Returns aggregated organizer metrics and event management records.
- `get_event_participants(p_event_id)`: Returns student roster for an organizer's event.

---

## 📱 Responsive Testing Breakpoints

The application has been engineered and tested across standard device viewports:
- **Mobile**: `375px` (Single column cards, collapsible drawer navigation, mobile filter panel)
- **Tablet**: `768px` (2-column grids, balanced dashboard metrics)
- **Laptop**: `1024px` (3-column event grid, desktop navigation)
- **Desktop**: `1440px` (Full-width layouts, comprehensive table views)

---

## 🔐 Evaluation Demo Flow

If evaluating without live Supabase credentials, the application includes an interactive fallback mode:
- **Student Demo**:
  1. Click **Log In** or **Get Started**
  2. Click **Student Account** demo shortcut (or enter `student@campus.edu`)
  3. Browse events at `/events`, filter by **Workshop**
  4. Open **Python Workshop** (shows 49 available seats out of 50)
  5. Click **Register Now** -> confirm in modal dialog
  6. Real-time updates show "Registration successful!", seat count decreases to 48, status updates to "Registered"
  7. Open **My Registrations** to view the active registration and option to cancel
- **Organizer Demo**:
  1. Click **Log In** -> click **Organizer Account** demo shortcut (or enter `organizer@campus.edu`)
  2. View **Organizer Dashboard** (`/organizer/dashboard`) with live metric counters
  3. Click **Create New Event**, fill out details, submit (created as **Draft**)
  4. In **Manage Events**, click **Publish** on the draft event -> confirmed
  5. View participants and close events when concluded
