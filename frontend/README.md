# ResumeATS — Frontend

AI-powered ATS Resume Analyzer frontend built with React.js + Tailwind CSS.
Connects to the provided Express/MongoDB backend.

---

## Tech Stack

| Layer         | Technology                |
|---------------|---------------------------|
| UI Library    | React 18                  |
| Routing       | React Router DOM v6       |
| HTTP Client   | Axios                     |
| State Mgmt    | Context API (no Redux)    |
| Styling       | Tailwind CSS v3           |
| Fonts         | Google Fonts (DM Sans + Playfair Display) |

---

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Alert.js          # Success/error/warning/info alert component
│   │   ├── FormInput.js      # Reusable input with password toggle + error display
│   │   ├── ProtectedRoute.js # Redirects unauthenticated users to /login
│   │   └── Spinner.js        # Loading spinner
│   └── layout/
│       ├── Layout.js         # Page wrapper with Navbar + footer
│       └── Navbar.js         # Responsive navbar with mobile hamburger
├── context/
│   └── AuthContext.js        # JWT token storage, login/logout, isAuthenticated
├── pages/
│   ├── HomePage.js           # Public landing page
│   ├── SignupPage.js         # New user registration
│   ├── LoginPage.js          # Login with redirect-back support
│   ├── DashboardPage.js      # Protected: stats + quick actions + recent analyses
│   ├── AnalyzePage.js        # Protected: file upload + job description form
│   ├── ResultPage.js         # Protected: ATS score + AI feedback display
│   ├── HistoryPage.js        # Protected: list of all past analyses
│   └── NotFoundPage.js       # 404 fallback
├── services/
│   ├── api.js                # Axios instance with base URL from .env
│   ├── authService.js        # register, login, logout API calls
│   └── resumeService.js      # uploadResume, getResumeHistory API calls
├── utils/
│   ├── helpers.js            # formatBytes, formatDate, extractATSScore, score colors
│   └── validators.js         # name, email, password, file, jobDescription validators
├── App.js                    # Root: AuthProvider + Router + all routes
├── index.js                  # ReactDOM.createRoot entry point
└── index.css                 # Tailwind directives + custom component utilities
```

---

## Setup & Installation

### Prerequisites
- Node.js ≥ 16
- The backend server running on `http://localhost:5000`

### 1. Install dependencies

```bash
npm install
```

This installs:
- `react`, `react-dom`, `react-scripts`
- `react-router-dom`
- `axios`
- `tailwindcss`, `autoprefixer`, `postcss`

### 2. Configure environment variables

Create `.env` in the project root (already included):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Change the URL if your backend runs on a different port or host.

### 3. Start the development server

```bash
npm start
```

The app runs at **http://localhost:3000**

### 4. Build for production

```bash
npm run build
```

Output goes to the `build/` folder.

---

## Backend API Mapping

| Frontend Action              | Method | Endpoint                  | Auth Required |
|------------------------------|--------|---------------------------|---------------|
| Register new user            | POST   | `/api/user/register`      | No            |
| Login                        | POST   | `/api/user/login`         | No            |
| Logout                       | POST   | `/api/user/logout`        | No            |
| Upload resume for analysis   | POST   | `/api/resume/upload`      | Yes (Bearer)  |
| Fetch resume history         | GET    | `/api/resume/history`     | Yes (Bearer)  |

### Authentication Flow
1. On login/register, backend returns `{ success: true, token: "..." }`
2. Token is stored in `localStorage` under key `ats_token`
3. `AuthContext` sets `Authorization: Bearer <token>` header on every Axios request
4. On logout, token is cleared from localStorage and Axios headers

### Resume Upload (multipart/form-data)
- Field `resume`: PDF or DOCX file, max **1 MB**
- Field `jobDescription`: string, min 20 characters
- Returns: `{ success, feedback, resumeId }`

---

## Pages Overview

| Route           | Access    | Description                                      |
|-----------------|-----------|--------------------------------------------------|
| `/`             | Public    | Landing page with features and CTA               |
| `/signup`       | Public    | Registration form with full validation           |
| `/login`        | Public    | Login form with redirect-back after auth         |
| `/dashboard`    | Protected | Stats, quick actions, 3 most recent analyses     |
| `/analyze`      | Protected | Resume upload + job description form             |
| `/result/:id`   | Protected | ATS score display + full Gemini AI feedback      |
| `/history`      | Protected | Complete list of past analyses                   |
| `*`             | Public    | 404 Not Found page                               |

---

## Validations

### Signup
- **Name**: required, 2–60 characters
- **Email**: valid email format
- **Password**: min 8 chars, uppercase + lowercase + number + special character

### Login
- **Email**: required, valid format
- **Password**: required

### Analyze
- **File**: required, PDF or DOCX only, max 1 MB
- **Job Description**: required, min 20 characters

---

## Notes for Developers

- All API errors from the backend are displayed via the `Alert` component
- The `ResultPage` works both from fresh analysis (via `location.state`) and direct URL navigation (fetches from history)
- The `extractATSScore` helper parses Gemini's free-text response to find the numeric score
- Password strength rules mirror the backend's `validator.isStrongPassword()` defaults
- The backend CORS is configured for `http://localhost:3000` — don't change the frontend port without updating the backend
