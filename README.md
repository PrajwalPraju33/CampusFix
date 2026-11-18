# CampusFix – AI-Powered Campus Maintenance Management System

> **Official Institutional Implementation for The National Institute of Engineering (NIE), Mysore**  
> Initial Campus: **NIE North Campus, Koorgalli, Mysuru**

---

## 1. Project Overview & Problem Statement

Campus infrastructure maintenance in large educational institutions often suffers from disjointed communication channels, delayed repair turnaround times, duplicate complaints from students in the same classroom or lab, and lack of real-time tracking transparency.

**CampusFix** is a full-stack, enterprise-grade, AI-powered campus maintenance and complaint lifecycle management system built from scratch for **The National Institute of Engineering (NIE), Mysore**. It bridges students and campus administration through two dedicated, secure portals, automated priority analysis with **Google Gemini AI**, an automated duplicate complaint detection engine, and an interactive status lifecycle tracker.

---

## 2. Institutional Branding & Campus Setup

- **Institution**: The National Institute of Engineering (NIE), Mysore (Estd. 1946)
- **Primary Campus**: NIE North Campus, Mysuru - 570018
- **Primary Academic Buildings Covered**:
  1. **Sankaracharya Bhavan** (Code: `SB`)
  2. **Madhvacharya Bhavan** (Code: `MB`)
  3. **Ramanujacharya Bhavan** (Code: `RB`)
- **Branding Assets**:
  - Official NIE Emblem Logo: `frontend/src/assets/images/nie-logo.png`
  - NIE North Campus Hero Image: `frontend/src/assets/images/nie-north-campus.jpg`

---

## 3. Technology Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, JavaScript (JSX), CSS3 SaaS Design System, React Router v6, Lucide React |
| **Backend** | Java 17 (Eclipse Temurin), Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Maven, JJWT 0.12.5 |
| **Database** | MySQL 8.0, H2 (for isolated test execution) |
| **AI Integration** | Google Gemini API (`gemini-1.5-flash`), Heuristic Fallback Engine |
| **DevOps & Containers** | Docker, Docker Compose, Nginx, Multi-Stage Builds |
| **CI / CD** | GitHub Actions, Git Feature Branch Workflow |
| **Testing** | JUnit 5, Mockito, Spring Security Test |

---

## 4. Key System Features

### A. Student Portal
- **Secure Authentication**: Student registration and login with JWT and BCrypt hashing.
- **Smart Complaint Submission**: Select campus, building, manual room/lab number, maintenance category, and problem description.
- **AI Complaint Analyzer**: Google Gemini AI analyzes the description in real-time, categorizing the issue, recommending priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), assigning maintenance departments, and suggesting immediate actions.
- **Duplicate Complaint Detection**: Compares active complaints in the same room/building using Jaccard text similarity and keyword matching to prevent redundant requests.
- **Unique Complaint ID Generation**: Automatically generates sequential identifiers (e.g. `CF-1001`, `CF-1002`).
- **Real-Time Lifecycle Tracking**: Visual status timeline tracking:
  $$\text{SUBMITTED} \rightarrow \text{VERIFIED} \rightarrow \text{ASSIGNED} \rightarrow \text{IN\_PROGRESS} \rightarrow \text{RESOLUTION\_SUBMITTED} \rightarrow \text{CLOSED}$$
- **Pending Complaint Editing**: Students can update complaint details while in `SUBMITTED` status.
- **Service Feedback & Rating**: 1 to 5 star rating and feedback upon complaint closure.
- **CampusFix AI Assistant**: Built-in chat advisor answering maintenance policies, Wi-Fi connectivity guidelines, and tracking questions.

### B. Admin Console
- **Role-Based Security**: Administrative console accessible only by accounts with `ROLE_ADMIN`. (Admin registration is non-public; initial admin is securely seeded).
- **Complaint Verification & Triage**: Verify or reject reported issues with audit remarks.
- **Technician Dispatch**: Assign qualified personnel (e.g. Electrical, AV, Plumbing, NOC Network Team).
- **Repair Status Updates**: Real-time updates to `IN_PROGRESS`, `ON_HOLD`, or `REOPENED`.
- **Resolution Approval**: Validate repairs, add technician sign-off notes, and officially close complaints.
- **Analytics & Facility Reporting**: View KPI breakdown, category distribution, resolution rates, and export printable official reports.
- **Campus & Building Management**: Configure institutional campuses and register new buildings.

---

## 5. Project Directory Structure

```
CampusFix/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/images/ (nie-logo.png, nie-north-campus.jpg)
│   │   ├── components/ (Navbar, StudentLayout, AdminLayout, StatusBadge, Timeline, ProtectedRoute)
│   │   ├── context/ (AuthContext.jsx)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── StudentRegister.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── student/ (Dashboard, SubmitComplaint, MyComplaints, ComplaintDetails, Profile, AiAssistant)
│   │   │   └── admin/ (Dashboard, AllComplaints, ComplaintDetails, Analytics, CampusManagement)
│   │   ├── services/ (api.js)
│   │   ├── styles/ (index.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
│
├── backend/
│   ├── src/main/java/com/campusfix/
│   │   ├── ai/ (GeminiAiService.java)
│   │   ├── config/ (DataSeeder.java)
│   │   ├── controller/ (Auth, Student, Admin, Public, Ai, FileUpload)
│   │   ├── dto/ (Auth, Complaint, Admin, AI, Duplicate DTOs)
│   │   ├── duplicate/ (DuplicateDetectionService.java)
│   │   ├── model/ (Institution, Campus, Building, User, Complaint, Assignment, StatusHistory, Feedback)
│   │   ├── repository/ (JPA Repositories)
│   │   ├── security/ (SecurityConfig, JwtProvider, JwtFilter, CustomUserDetailsService)
│   │   ├── service/ (AuthService, ComplaintService, AdminService, FileStorageService)
│   │   └── CampusFixApplication.java
│   ├── src/main/resources/ (application.yml, application-test.yml)
│   ├── src/test/java/com/campusfix/ (AuthServiceTests, ComplaintServiceTests, DuplicateDetectionTests, ContextTests)
│   ├── pom.xml
│   └── Dockerfile
│
├── database/
│   ├── schema.sql
│   └── sample-data.sql
│
├── docs/
│   ├── architecture.md
│   └── api-documentation.md
│
├── .github/workflows/
│   └── build.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. Default Demo Credentials & Seed Data

The database seeder automatically provisions test accounts and realistic sample records upon initial launch:

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@nie.ac.in` | `Admin@NIE2026` | `/admin/login` |
| **Student** | `student@nie.ac.in` | `Student@NIE2026` | `/student/login` |

### Pre-Seeded Sample Complaints (for Expo Demonstration):
1. **CF-1001**: `Wi-Fi Router Unreachable in Lab 204` (Sankaracharya Bhavan, Lab 204) – Status: `IN_PROGRESS`, Assigned to: `K. S. Narayanan (Network Team)`
2. **CF-1002**: `Ceiling Fan making noise and regulator broken` (Madhvacharya Bhavan, Classroom 301) – Status: `VERIFIED`
3. **CF-1003**: `Projector HDMI display flickering in Seminar Hall` (Ramanujacharya Bhavan, Seminar Hall 1) – Status: `CLOSED`, Rated 5 Stars by student
4. **CF-1004**: `Drinking water cooler filtration tap leakage` (Sankaracharya Bhavan, 2nd Floor Corridor) – Status: `SUBMITTED`

---

## 7. Local Execution Instructions

### Prerequisites
- Java 17+ (JDK 17 recommended)
- Node.js 18+ and npm
- Apache Maven 3.8+ (or included wrapper)
- MySQL 8.0 (Optional for local test profile, mandatory for production)

### Step 1: Run Backend
```powershell
cd backend
$env:JAVA_HOME = "C:\Users\prajw\AppData\Local\Programs\jdk-17\jdk-17.0.12+7" # or your JDK 17 path
mvn clean spring-boot:run
```
The Spring Boot backend starts at `http://localhost:8080`.

### Step 2: Run Frontend
```powershell
cd frontend
npm install
npm run dev
```
The React frontend starts at `http://localhost:5173`.

---

## 8. Docker Deployment

Deploy the entire full-stack system (Frontend, Backend, and MySQL 8.0) using Docker Compose:

```powershell
# 1. Build and start all containers in detached mode
docker compose up --build -d

# 2. Check running services
docker compose ps

# 3. View live logs
docker compose logs -f

# 4. Stop all containers
docker compose down
```

### URLs when running in Docker:
- **Frontend & App Gateway**: `http://localhost:80`
- **Backend API**: `http://localhost:8080/api`
- **MySQL Database**: `localhost:3306` (Database: `campusfix`)

---

## 9. Google Gemini AI Setup

CampusFix uses Google Gemini for real-time complaint analysis and the interactive chat assistant.

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Set the environment variable before starting the application:
   ```powershell
   $env:GEMINI_API_KEY = "your-actual-gemini-api-key"
   $env:GEMINI_MODEL = "gemini-1.5-flash"
   ```
3. *Fallback Note*: If `GEMINI_API_KEY` is not provided or API rate limits occur, CampusFix activates its internal **Heuristic Fallback Engine**, ensuring the analyzer and chat assistant continue functioning reliably without errors.

---

## 10. Automated Testing Results

The test suite runs 10 automated unit and integration tests across security, complaint ownership, duplicate detection, and context loading:

```
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Tests include:
- `AuthServiceTests`: Student registration, duplicate email rejection, admin credential authentication, invalid password rejection.
- `ComplaintServiceTests`: Complaint submission, CF-xxxx ID generation, strict student isolation (students cannot view or edit others' complaints), pending complaint editing.
- `DuplicateDetectionTests`: Automated detection of duplicate complaints in the same building and room.
- `CampusFixApplicationTests`: Full Spring Boot context and JPA repository verification.

---

## 11. Git & GitHub Workflow

CampusFix follows standard feature branch branching strategy:

- `main`: Production-ready release branch.
- `develop`: Integration branch.
- Feature branches:
  - `feature/student-portal`
  - `feature/admin-portal`
  - `feature/auth-backend`
  - `feature/database-ai`
  - `feature/devops`

To push to GitHub:
```powershell
git add .
git commit -m "feat: complete full-stack CampusFix system for NIE Mysore"
git remote add origin https://github.com/your-username/CampusFix.git
git push -u origin main
```
