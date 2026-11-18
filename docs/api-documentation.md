# CampusFix REST API Documentation

Base URL: `http://localhost:8080/api`

All authenticated endpoints require an `Authorization: Bearer <token>` HTTP header.

---

## 1. Authentication Endpoints

### Register Student
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public (Students only; Admin registration is locked)
- **Request Body**:
```json
{
  "name": "Prajwal Rao",
  "email": "student@nie.ac.in",
  "password": "Password@123",
  "campusId": 1
}
```
- **Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 2,
  "name": "Prajwal Rao",
  "email": "student@nie.ac.in",
  "role": "STUDENT",
  "institutionId": 1,
  "institutionName": "The National Institute of Engineering (NIE), Mysore",
  "campusId": 1,
  "campusName": "NIE North Campus"
}
```

### Login (Student or Admin)
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@nie.ac.in",
  "password": "Admin@NIE2026"
}
```
- **Response**: `200 OK` (includes JWT token and user profile)

---

## 2. Public Endpoints

### Get Campuses
- **Endpoint**: `GET /api/public/campuses`
- **Access**: Public

### Get Buildings
- **Endpoint**: `GET /api/public/campuses/{campusId}/buildings`
- **Access**: Public

### Get Maintenance Categories
- **Endpoint**: `GET /api/public/categories`
- **Access**: Public

---

## 3. Student Portal Endpoints (`ROLE_STUDENT`)

### Submit Complaint
- **Endpoint**: `POST /api/student/complaints`
- **Access**: Authenticated Student
- **Request Body**:
```json
{
  "campusId": 1,
  "buildingId": 1,
  "category": "Wi-Fi and Network",
  "problemTitle": "Wi-Fi access point unreachable in Lab 204",
  "description": "DHCP is failing on NIE-Academic-5G SSID. Router LED is red.",
  "roomLabNo": "Lab 204",
  "priority": "HIGH",
  "attachmentPaths": ["/api/uploads/sample.jpg"]
}
```
- **Response**: `200 OK` (Returns complaint record with generated ID `CF-1005`)

### Get My Complaints
- **Endpoint**: `GET /api/student/complaints/my`
- **Access**: Authenticated Student (Only returns complaints owned by the student)

### Get Complaint Details
- **Endpoint**: `GET /api/student/complaints/{id}`
- **Access**: Authenticated Student (Enforces strict ownership check)

### Edit Pending Complaint
- **Endpoint**: `PUT /api/student/complaints/{id}`
- **Access**: Authenticated Student (Only allowed if status is `SUBMITTED`)

### Submit Feedback
- **Endpoint**: `POST /api/student/complaints/{id}/feedback`
- **Access**: Authenticated Student (Only allowed if status is `CLOSED`)
- **Request Body**:
```json
{
  "rating": 5,
  "comments": "The maintenance engineer fixed the Wi-Fi router within 2 hours. Excellent speed!"
}
```

---

## 4. Admin Console Endpoints (`ROLE_ADMIN`)

### Filter & List All Complaints
- **Endpoint**: `GET /api/admin/complaints`
- **Query Params**: `campusId`, `buildingId`, `category`, `status`
- **Access**: Authenticated Admin

### Verify or Reject Complaint
- **Endpoint**: `POST /api/admin/complaints/{id}/verify`
- **Access**: Authenticated Admin
- **Request Body**:
```json
{
  "verified": true,
  "remarks": "Verified on site by lab instructor. Genuine hardware fault."
}
```

### Assign Maintenance Personnel
- **Endpoint**: `POST /api/admin/complaints/{id}/assign`
- **Access**: Authenticated Admin
- **Request Body**:
```json
{
  "assignedTo": "K. S. Narayanan (Network Team)",
  "remarks": "Inspect switch port and reboot router access point."
}
```

### Update Repair Progress
- **Endpoint**: `PATCH /api/admin/complaints/{id}/status`
- **Access**: Authenticated Admin
- **Request Body**:
```json
{
  "status": "IN_PROGRESS",
  "remarks": "Technician is diagnosing the wireless access point on site."
}
```

### Approve Resolution & Close
- **Endpoint**: `POST /api/admin/complaints/{id}/resolve`
- **Access**: Authenticated Admin
- **Request Body**:
```json
{
  "resolutionRemarks": "AP replaced with new Cisco Catalyst module. Tested and working.",
  "approveAndClose": true
}
```

### Get Dashboard Statistics
- **Endpoint**: `GET /api/admin/dashboard`
- **Access**: Authenticated Admin

### Get Reports
- **Endpoint**: `GET /api/admin/reports`
- **Access**: Authenticated Admin

### Add Campus Building
- **Endpoint**: `POST /api/admin/buildings`
- **Access**: Authenticated Admin
- **Request Body**:
```json
{
  "campusId": 1,
  "name": "Visvesvaraya Bhavan",
  "code": "VB"
}
```

---

## 5. AI Integration Endpoints

### Smart Complaint Analyzer
- **Endpoint**: `POST /api/ai/analyze`
- **Access**: Authenticated User
- **Request Body**:
```json
{
  "problemTitle": "Wi-Fi down",
  "description": "Internet not working in Lab 204",
  "category": "Wi-Fi and Network",
  "campusId": 1,
  "buildingId": 1,
  "buildingName": "Sankaracharya Bhavan",
  "roomLabNo": "Lab 204"
}
```
- **Response**:
```json
{
  "problemTitle": "Wi-Fi Router Gateway Outage in Lab 204",
  "category": "Wi-Fi and Network",
  "suggestedPriority": "HIGH",
  "maintenanceDepartment": "Campus IT & Network Operations Centre (NOC)",
  "summary": "Automated smart analysis: Identified Wi-Fi issue in Lab 204. High severity due to lab disruption.",
  "recommendedAction": "Inspect wireless access point gateway and DHCP pool allocation.",
  "duplicateWarning": true,
  "potentialDuplicates": [
    {
      "id": 1,
      "complaintNumber": "CF-1001",
      "problemTitle": "Wi-Fi Router Unreachable in Lab 204",
      "category": "Wi-Fi and Network",
      "roomLabNo": "Lab 204",
      "status": "IN_PROGRESS",
      "similarityScore": 0.85,
      "matchReason": "Same room/lab location (Lab 204). Same maintenance category."
    }
  ]
}
```

### Check Duplicates
- **Endpoint**: `POST /api/ai/check-duplicates`
- **Access**: Authenticated User

### CampusFix AI Assistant Chat
- **Endpoint**: `POST /api/ai/chat`
- **Access**: Authenticated User
- **Request Body**:
```json
{
  "message": "How do I report a Wi-Fi issue?"
}
```
- **Response**:
```json
{
  "reply": "To report a Wi-Fi issue at NIE North Campus:\n1. Navigate to Submit Complaint.\n2. Select your building and enter your room/lab number.\n3. Mention the SSID (e.g., NIE-Academic-5G) and whether router LEDs are red.\n4. Click AI Analysis to get priority recommendations.",
  "helpfulLinks": ["/student/submit-complaint", "/student/my-complaints"],
  "suggestedPrompts": ["What does IN_PROGRESS mean?", "How long do electrical repairs take?"]
}
```
