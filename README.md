# SmartSeason — Field Monitoring System

> A full-stack web application for tracking crop progress across multiple fields during a growing season.

---

## 🌐 Live Demo
https://smartseason-monitoring.vercel.app/

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup (Optional)](#docker-setup-optional)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Assumptions](#assumptions)

---

## Overview

SmartSeason helps agricultural coordinators and field agents track crop fields through their growing lifecycle — from planting to harvest. Admins get a full system overview; agents see only their assigned fields.

---

## Tech Stack

**Backend**
- Python 3.13 / Django 5.x
- Django REST Framework
- Simple JWT (authentication)
- PostgreSQL (production) / SQLite (development)
- django-filters (query filtering)
- drf-yasg (Swagger / ReDoc API docs)
- Whitenoise (static files)

**Frontend**
- React 18 + Vite
- React Redux (global auth state)
- TanStack Query v5 (server state & caching)
- React Router v6 (nested routing)
- Tailwind CSS
- Recharts (dashboard charts)
- React Hook Form + Zod (form validation)
- Lucide React (icons)

---

## Project Structure

```
smartseason/
├── Backend/                  # Django project
│   ├── apps/
│   │   ├── users/            # User model, auth, roles
│   │   ├── fields/           # Fields, assignments, observations
│   │   └── core/             # Shared base models & utilities
│   ├── Backend/              # Django settings, URLs
│   └── manage.py
│
└── frontend/                 # React + Vite project
    └── src/
        ├── components/       # UI components (layout, fields, users, shared)
        ├── pages/            # Route-level page components
        ├── services/         # Axios API calls + TanStack Query hooks
        ├── store/            # Redux slices (auth)
        └── utils/            # Helpers (date formatting, etc.)
```

---

## Design Decisions

### Field Status Logic

Status is a computed property — it's not stored anywhere in the database. Every time you fetch a field, the status is calculated on the fly from two things: what stage the field is currently in, and how long it's been since planting.

| Status | Condition |
|--------|-----------|
| `COMPLETED` | Stage is `HARVESTED` |
| `AT_RISK` | Days since planting exceeds the threshold **and** stage is still `PLANTED` or `GROWING` |
| `ACTIVE` | Everything else — field is moving along normally |

Each field has an optional `threshold_days` value. If you don't set one, it falls back to 90 days. The reason this exists per-field rather than as a global setting is that different crops genuinely have different timelines — a fast-growing vegetable shouldn't be flagged at risk using the same threshold as a slow-maturing grain.

The reason status isn't stored: if it were, you'd need a background job running every night to recompute it, or risk it going stale. Deriving it from the planting date and current stage means it's always accurate without any extra work.

**Example:** a field planted 100 days ago, still in `GROWING`, with no custom threshold set — that gets flagged `AT_RISK` because it's passed 90 days without reaching `READY`.

### Stage Progression

Observations advance a field through a strict one-way lifecycle:

```
PLANTED → GROWING → READY → HARVESTED
```

The service layer enforces valid progressions — agents cannot skip stages or move a field backward. Once harvested, a field is locked from further observations.


### Authentication

JWT-based auth via Simple JWT. Access tokens are short-lived; when one expires, the frontend detects the 401 response and shows a session-expired modal prompting re-login rather than a hard redirect.

### Dashboard

- **Admin dashboard** — system-wide field stats, stage distribution, risk distribution, observation trend, and per-agent performance.
- **Agent dashboard** — personal stats: assigned fields, status breakdown, recent observations.

All metrics are computed server-side in a dedicated `DashboardService` to keep views thin.

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (or use SQLite for local dev)

---

### Backend Setup

**1. Clone and navigate**

```bash
git clone https://github.com/mutungapeter/smartseason-monitoring.git
cd smartseason-monitoring/Backend
```

**2. Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure environment variables**

```bash
cp .env.sample .env
```

Fill in your values. See [Environment Variables](#environment-variables) for all keys.

**5. Set up PostgreSQL**

```sql
CREATE DATABASE smartseason;
CREATE USER postgres WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE smartseason TO postgres;
```

**6. Run migrations**

```bash
python manage.py migrate
```

**7. Seed demo data (optional)**

```bash      # Creates admin + agent accounts
python manage.py seed_demo_data    # Creates sample users, fields and observations
```
for the credentials of the seeded users ,look into this file fields/management/commands/seed_demo_data

**8. Start the development server**

```bash
python manage.py runserver
```

The API runs at `http://localhost:8000`

Interactive API docs:
- Swagger UI → `http://localhost:8000/docs/`
- ReDoc → `http://localhost:8000/redoc/`

---

### Frontend Setup

**1. Navigate to the frontend directory**

```bash
cd smartseason-monitoring/frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8000
```

**4. Start the development server**

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---



## Environment Variables

### Backend `.env`

```env
# Django
SECRET_KEY= check in .env.sample
JWT_SIGNING_KEY= check in .env.sample
DEBUG=True

# Allowed hosts (comma-separated)
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DB_NAME=smartseason
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# CORS (comma-separated frontend origins)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

> **SQLite vs PostgreSQL:** The project defaults to SQLite for development convenience. To switch to PostgreSQL, uncomment the PostgreSQL `DATABASES` block in `settings.py` and comment out the SQLite one. Always use PostgreSQL in production.

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## API Overview

Full interactive documentation is available at `http://localhost:8000/docs/` when the backend is running.

### Authenticating in Swagger

1. Call `POST /users/auth/login/` with your email and password — copy the `access` token from the response.
2. Click the **Authorize** button at the top of the Swagger page.
3. In the value field, type `Bearer` followed by a space, then paste your token:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Click **Authorize** then **Close**. All subsequent requests will send the token automatically.

---

### Fields

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/fields/` | List fields | Admin (all) / Agent (assigned only) |
| `POST` | `/fields/create/` | Create a new field | Admin |
| `GET` | `/fields/{id}/` | Field detail with assignments & observations | Admin / Assigned Agent |
| `PUT` | `/fields/{id}/` | Full update of a field | Admin |
| `PATCH` | `/fields/{id}/` | Partial update of a field | Admin |
| `DELETE` | `/fields/{id}/` | Delete a field | Admin |
| `POST` | `/fields/assign/` | Assign or reassign an agent to a field | Admin |
| `GET` | `/fields/assignments/` | List all field assignments | Admin |
| `GET` | `/fields/dashboard-overview/` | Dashboard metrics | Admin / Agent |
| `POST` | `/fields/observations/create/` | Record a new observation | Agent |
| `GET` | `/fields/observations/{id}/` | Get a single observation | Admin / Author |
| `PUT` | `/fields/observations/{id}/` | Full update of an observation | Admin / Author |
| `PATCH` | `/fields/observations/{id}/` | Partial update of an observation | Admin / Author |
| `DELETE` | `/fields/observations/{id}/` | Delete an observation | Admin / Author |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/users/auth/login/` | Login — returns access + refresh tokens | Public |
| `POST` | `/users/auth/logout/` | Logout — blacklists the refresh token | Authenticated |
| `GET` | `/users/auth/me/` | Get the current logged-in user | Authenticated |
| `GET` | `/users/` | List all users | Admin |
| `POST` | `/users/create/` | Create a new user | Admin |
| `GET` | `/users/{id}/` | Get a user by ID | Admin |
| `PUT` | `/users/{id}/` | Full update of a user | Admin |
| `PATCH` | `/users/{id}/` | Partial update of a user | Admin |
| `DELETE` | `/users/{id}/` | Delete a user | Admin |

---

## Assumptions

- A field has at most one assigned agent at a time. Reassigning replaces the existing assignment rather than stacking a second one.
- Stage progression is strictly sequential — agents cannot skip stages or move a field backward.
- `threshold_days` defaults to 90 if not set, to accommodate different crop growth cycles.
- Admins cannot add observations — that's the agent's job. This reflects the real-world split between coordination and fieldwork.
- Passwords are never returned from the API. On the edit user form, leaving the password field blank keeps the existing password unchanged.
- The system uses UTC internally. Dates are formatted on the client side.