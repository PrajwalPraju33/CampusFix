# CampusFix Architecture Specification

## Institution & Campus Identity
- **Institution**: The National Institute of Engineering (NIE), Mysore
- **Campus**: NIE North Campus, Koorgalli Industrial Area, Mysuru - 570018
- **Initial Campus Buildings**:
  1. **Sankaracharya Bhavan** (Code: `SB`)
  2. **Madhvacharya Bhavan** (Code: `MB`)
  3. **Ramanujacharya Bhavan** (Code: `RB`)

---

## High-Level System Architecture

```mermaid
graph TD
    subgraph Client ["Client Presentation Tier (React + Vite)"]
        Landing["Landing Page (NIE Branding)"]
        SPortal["Student Portal (Complaints, Tracking, Feedback)"]
        APortal["Admin Console (Verification, Dispatch, Analytics)"]
    end

    subgraph Gateway ["Nginx / API Gateway (Port 80 / Reverse Proxy)"]
        StaticProxy["Static Asset Engine"]
        ApiProxy["Reverse Proxy to /api"]
    end

    subgraph Backend ["Backend Tier (Spring Boot 3.2 - Java 17)"]
        Security["Spring Security 6 + JWT + BCrypt"]
        Controllers["REST API Controllers"]
        Services["Business Services"]
        AiEngine["Google Gemini 1.5/2.0 API & Heuristic Fallback"]
        DupEngine["Duplicate Detection Engine (Jaccard + N-gram)"]
        JPA["Spring Data JPA / Hibernate"]
    end

    subgraph Data ["Database Tier (MySQL 8.0)"]
        Schema["campusfix schema"]
        Tables["institutions, campuses, buildings, users, complaints, assignments, status_history, attachments, feedback"]
    end

    Landing --> Gateway
    SPortal --> Gateway
    APortal --> Gateway

    Gateway --> StaticProxy
    Gateway --> ApiProxy

    ApiProxy --> Security
    Security --> Controllers
    Controllers --> Services
    Services --> AiEngine
    Services --> DupEngine
    Services --> JPA
    JPA --> Schema
    Schema --> Tables
```

---

## Two-Portal Security Boundary

```mermaid
flowchart LR
    User([User]) --> Auth{Authentication & Role}
    Auth -- "Role: STUDENT" --> StudentPortal[Student Portal]
    Auth -- "Role: ADMIN" --> AdminPortal[Admin Console]

    subgraph StudentCapabilities ["Student Capabilities"]
        SC1[Submit Complaint]
        SC2[View Own Complaints Only]
        SC3[Edit Pending Submitted Complaints]
        SC4[Submit Rating Feedback on Closed]
        SC5[Access CampusFix AI Assistant]
    end

    subgraph AdminCapabilities ["Admin Capabilities"]
        AC1[View All Campus Complaints]
        AC2[Verify or Reject Reports]
        AC3[Assign Maintenance Personnel]
        AC4[Update Status to IN_PROGRESS]
        AC5[Approve Resolution & Close]
        AC6[Analytics & Facility Management]
    end

    StudentPortal --> StudentCapabilities
    AdminPortal --> AdminCapabilities
```

---

## Complaint State Machine Workflow

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Student Submits Complaint
    SUBMITTED --> VERIFIED : Admin Verifies
    SUBMITTED --> REJECTED : Admin Rejects (with remarks)
    VERIFIED --> ASSIGNED : Admin Assigns Technician
    ASSIGNED --> IN_PROGRESS : Work Commences On-Site
    IN_PROGRESS --> ON_HOLD : Awaiting Spare Parts / Vendor
    ON_HOLD --> IN_PROGRESS : Parts Procured
    IN_PROGRESS --> RESOLUTION_SUBMITTED : Technician Submits Work Done
    RESOLUTION_SUBMITTED --> CLOSED : Admin Approves & Signs Off
    CLOSED --> [*]
    CLOSED --> REOPENED : Issue Recurred
    REOPENED --> IN_PROGRESS : Re-investigating
```

---

## Database ER Diagram

```mermaid
erDiagram
    INSTITUTIONS ||--o{ CAMPUSES : contains
    CAMPUSES ||--o{ BUILDINGS : houses
    CAMPUSES ||--o{ USERS : enrolls
    BUILDINGS ||--o{ COMPLAINTS : located_in
    USERS ||--o{ COMPLAINTS : reports
    COMPLAINTS ||--o{ ASSIGNMENTS : dispatched_to
    COMPLAINTS ||--o{ STATUS_HISTORY : audit_trail
    COMPLAINTS ||--o{ ATTACHMENTS : evidence
    COMPLAINTS ||--o| FEEDBACK : rated_by

    INSTITUTIONS {
        bigint id PK
        varchar name
        varchar code
        varchar address
    }

    CAMPUSES {
        bigint id PK
        bigint institution_id FK
        varchar name
        varchar address
    }

    BUILDINGS {
        bigint id PK
        bigint campus_id FK
        varchar name
        varchar code
    }

    USERS {
        bigint id PK
        varchar name
        varchar email
        varchar password
        enum role
        bigint campus_id FK
    }

    COMPLAINTS {
        bigint id PK
        varchar complaint_number
        bigint campus_id FK
        bigint building_id FK
        bigint user_id FK
        varchar category
        varchar problem_title
        text description
        varchar room_lab_no
        enum priority
        enum status
    }
```
