# VidyaTrack API Documentation

## Base URL
```
Production: https://your-domain.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require an **Authorization** header:
```
Authorization: Bearer <token>
```

Tokens are obtained via `POST /auth/login` or `POST /teachers/login`.

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Teacher Management (Admin)](#2-teacher-management-admin)
3. [User Profile](#3-user-profile)
4. [Dashboard](#4-dashboard)
5. [Classes](#5-classes)
6. [Students](#6-students)
7. [Attendance](#7-attendance)
8. [Fees](#8-fees)
9. [Syllabus](#9-syllabus)
10. [Homework](#10-homework)
11. [Notices](#11-notices)
12. [Parent Portal](#12-parent-portal)
13. [Role-Based Access Summary](#13-role-based-access-summary)
14. [Error Handling](#14-error-handling)
15. [Environment Variables](#15-environment-variables)

---

## 1. Authentication

### POST /auth/register
Register a new user (Institute or Teacher).

**Access:** Public

**Request:**
```json
{
  "mobile": "9876543210",
  "password": "password123",
  "role": "institute",
  "name": "Vin",
  "instituteName": "Sharma Coaching",
  "city": "Delhi"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| mobile | string | Yes | 10 digit mobile number |
| password | string | Yes | Minimum 6 characters |
| role | string | No | "institute" (default) or "teacher" |
| name | string | No | Owner/manager name |
| instituteName | string | No | Name of coaching institute |
| city | string | No | City name |

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "mobile": "9876543210",
      "role": "institute",
      "name": "Vin",
      "instituteName": "Sharma Coaching",
      "city": "Delhi",
      "isActive": true,
      "createdAt": "2026-04-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/login
Login with mobile and password (for Institute users and Teachers registered via `/auth/register`).

**Access:** Public

**Request:**
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "mobile": "9876543210",
      "role": "institute",
      "name": "Vin",
      "instituteName": "Sharma Coaching",
      "city": "Delhi",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/refresh
Refresh access token using refresh token.

**Access:** Public

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /auth/me
Get current logged-in user profile.

**Access:** Authenticated (Institute, Teacher)

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": "uuid",
    "mobile": "9876543210",
    "role": "institute",
    "name": "Vin",
    "instituteName": "Sharma Coaching",
    "city": "Delhi",
    "isActive": true,
    "createdAt": "2026-04-05T10:00:00.000Z"
  }
}
```

---

### POST /auth/logout
Logout user (invalidate tokens).

**Access:** Authenticated (Institute, Teacher)

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

### PUT /auth/profile
Update profile.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "name": "Vin Updated",
  "email": "vin@example.com",
  "instituteName": "Updated Coaching",
  "city": "Mumbai",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "mobile": "9876543210",
    "role": "institute",
    "name": "Vin Updated",
    "instituteName": "Updated Coaching",
    "city": "Mumbai",
    "isActive": true
  }
}
```

---

## 2. Teacher Management (Admin)

### POST /teachers (Register Teacher)
Admin registers a teacher. Creates both a **Teacher** record and a **User** record (role: "teacher") with login credentials. The teacher can then login via `POST /teachers/login`.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "teacherName": "Ramesh Kumar",
  "joiningDate": "2024-04-01",
  "subject": "Science",
  "mobile": "9876543211",
  "qualification": "M.Sc",
  "email": "ramesh@example.com",
  "password": "temp123"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| teacherName | string | Yes | Teacher full name |
| joiningDate | string (YYYY-MM-DD) | Yes | Joining date |
| subject | string | Yes | Subject name |
| mobile | string | Yes | 10 digit mobile (unique) |
| qualification | string | Yes | Teacher qualification |
| email | string | Yes | Email address |
| password | string | No | Login password (min 6 chars). Defaults to mobile number if not provided |

**Response (201):**
```json
{
  "success": true,
  "message": "Teacher registered successfully",
  "data": {
    "id": "uuid",
    "name": "Ramesh Kumar",
    "joiningDate": "2024-04-01T00:00:00.000Z",
    "subject": "Science",
    "mobile": "9876543211",
    "qualification": "M.Sc",
    "email": "ramesh@example.com",
    "isActive": true,
    "classCount": 0,
    "classes": []
  }
}
```

---

### POST /teachers/login (Teacher Login)
Teacher login using mobile and password set during registration.

**Access:** Public

**Request:**
```json
{
  "mobile": "9876543211",
  "password": "temp123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Teacher login successful",
  "data": {
    "teacher": {
      "id": "uuid",
      "name": "Ramesh Kumar",
      "subject": "Science",
      "mobile": "9876543211",
      "qualification": "M.Sc",
      "email": "ramesh@example.com",
      "isActive": true,
      "classCount": 2,
      "classes": [
        { "id": "uuid", "name": "Class 8", "subject": "Science" }
      ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** The JWT token returned here can be used to access all teacher-accessible endpoints (classes, students read-only, attendance, syllabus). The `role` in the token is `"teacher"`.

---

### GET /teachers
Get all teachers in the institute.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Teachers retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Ramesh Kumar",
      "joiningDate": "2024-04-01T00:00:00.000Z",
      "subject": "Science",
      "mobile": "9876543211",
      "qualification": "M.Sc",
      "email": "ramesh@example.com",
      "classCount": 2,
      "classes": []
    }
  ]
}
```

---

### GET /teachers/:id
Get teacher details.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Teacher retrieved",
  "data": {
    "id": "uuid",
    "name": "Ramesh Kumar",
    "joiningDate": "2024-04-01T00:00:00.000Z",
    "subject": "Science",
    "mobile": "9876543211",
    "qualification": "M.Sc",
    "email": "ramesh@example.com",
    "classCount": 2,
    "classes": [
      { "id": "uuid", "name": "Class 8", "subject": "Science" }
    ]
  }
}
```

---

### PUT /teachers/:id
Update teacher.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "teacherName": "Ramesh Kumar Sir",
  "subject": "Physics",
  "qualification": "M.Phil",
  "email": "ramesh.kumar@example.com",
  "password": "newpass123"
}
```

---

### DELETE /teachers/:id
Soft delete teacher.

**Access:** Authenticated (Institute only)

---

### GET /teachers/trash
Get soft-deleted teachers.

**Access:** Authenticated (Institute only)

---

### POST /teachers/:id/restore
Restore soft-deleted teacher.

**Access:** Authenticated (Institute only)

---

### DELETE /teachers/:id/permanent
Permanently delete teacher.

**Access:** Authenticated (Institute only)

---

## 3. User Profile

(Same as GET /auth/me — see Authentication section)

---

## 4. Dashboard

### GET /dashboard/stats
Get dashboard statistics.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved",
  "data": {
    "classes": 6,
    "teachers": 8,
    "students": 142,
    "feePending": 12,
    "feeCollected": 120000,
    "feePendingAmount": 18000
  }
}
```

---

### GET /dashboard/overview
Get dashboard overview (classes, pending fees, recent notices).

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard overview retrieved",
  "data": {
    "classes": [
      {
        "id": "uuid",
        "name": "Class 8",
        "subject": "Science",
        "monthlyFee": 1500,
        "teacher": { "name": "Ramesh Kumar" },
        "_count": { "students": 28 }
      }
    ],
    "pendingFees": [
      {
        "id": "uuid",
        "amount": 1500,
        "month": "April",
        "year": 2024,
        "student": {
          "name": "Amit Verma",
          "class": { "name": "Class 8" }
        }
      }
    ],
    "notices": [
      {
        "id": "uuid",
        "title": "Holiday Notice",
        "message": "Coaching closed on 25 April",
        "type": "holiday",
        "priority": "normal",
        "createdAt": "2026-04-05T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. Classes

### POST /classes
Create a new class.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "name": "Class 8",
  "subject": "Science",
  "monthlyFee": 1500,
  "teacherId": "uuid",
  "startTime": "7:00 AM",
  "endTime": "9:00 AM",
  "days": "Mon,Wed,Fri"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Class name (e.g., "Class 8") |
| subject | string | Yes | Subject name |
| monthlyFee | integer | No | Monthly fee in rupees (default: 0) |
| teacherId | string (UUID) | No | Assign teacher to class |
| startTime | string | No | Class start time (e.g., "7:00 AM") |
| endTime | string | No | Class end time (e.g., "9:00 AM") |
| days | string | No | Days (e.g., "Mon,Wed,Fri") |

**Response (201):**
```json
{
  "success": true,
  "message": "Class created successfully",
  "data": {
    "id": "uuid",
    "name": "Class 8",
    "subject": "Science",
    "monthlyFee": 1500,
    "startTime": "7:00 AM",
    "endTime": "9:00 AM",
    "days": "Mon,Wed,Fri",
    "isActive": true,
    "teacher": { "id": "uuid", "name": "Ramesh Kumar" }
  }
}
```

---

### GET /classes
Get all classes.

**Access:** Authenticated (Institute, Teacher)

**Response (200):**
```json
{
  "success": true,
  "message": "Classes retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Class 8",
      "subject": "Science",
      "monthlyFee": 1500,
      "teacher": { "id": "uuid", "name": "Ramesh Kumar" },
      "_count": { "students": 28 }
    }
  ]
}
```

---

### GET /classes/:id
Get class details.

**Access:** Authenticated (Institute, Teacher)

**Response (200):**
```json
{
  "success": true,
  "message": "Class retrieved",
  "data": {
    "id": "uuid",
    "name": "Class 8",
    "subject": "Science",
    "monthlyFee": 1500,
    "startTime": "7:00 AM",
    "endTime": "9:00 AM",
    "days": "Mon,Wed,Fri",
    "isActive": true,
    "teacher": { "id": "uuid", "name": "Ramesh Kumar" },
    "students": [
      { "id": "uuid", "name": "Rahul Sharma", "parentMobile": "9876543210", "joiningDate": "2024-01-15T00:00:00.000Z" }
    ],
    "_count": { "students": 28 }
  }
}
```

---

### PUT /classes/:id
Update class.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "name": "Class 8 - Science",
  "subject": "Physics",
  "monthlyFee": 2000,
  "teacherId": "uuid",
  "startTime": "8:00 AM",
  "endTime": "10:00 AM",
  "days": "Tue,Thu,Sat"
}
```

---

### DELETE /classes/:id
Soft delete class.

**Access:** Authenticated (Institute only)

---

### GET /classes/trash
Get soft-deleted classes.

**Access:** Authenticated (Institute only)

---

### POST /classes/:id/restore
Restore soft-deleted class.

**Access:** Authenticated (Institute only)

---

### DELETE /classes/:id/permanent
Permanently delete class.

**Access:** Authenticated (Institute only)

---

### GET /classes/stats
Get class statistics.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Stats retrieved",
  "data": {
    "classes": 6,
    "teachers": 8,
    "students": 142
  }
}
```

---

## 6. Students

### POST /students
Add a new student.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "name": "Rahul Sharma",
  "parentMobile": "9876543212",
  "classId": "uuid",
  "address": "123 Main Street, Delhi",
  "joiningDate": "2024-04-01",
  "createInitialFee": true
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Student full name |
| parentMobile | string | Yes | 10 digit parent mobile |
| classId | string (UUID) | Yes | Class UUID |
| address | string | No | Student address |
| joiningDate | string (ISO date) | No | Joining date (default: today) |
| createInitialFee | boolean | No | Create pending fee (default: false) |

**Response (201):**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "id": "uuid",
    "name": "Rahul Sharma",
    "parentMobile": "9876543212",
    "classId": "uuid",
    "class": { "id": "uuid", "name": "Class 8" },
    "address": "123 Main Street, Delhi",
    "joiningDate": "2024-04-01T00:00:00.000Z",
    "isActive": true
  }
}
```

---

### GET /students
Get all students.

**Access:** Authenticated (Institute, Teacher)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| classId | string (UUID) | Filter by class |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20) |

**Example:** `GET /students?classId=uuid&page=1&limit=20`

**Response (200):**
```json
{
  "success": true,
  "message": "Students retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Rahul Sharma",
      "parentMobile": "9876543212",
      "class": { "id": "uuid", "name": "Class 8" },
      "feeStatus": "paid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

---

### GET /students/:id
Get student details with fee history.

**Access:** Authenticated (Institute, Teacher)

**Response (200):**
```json
{
  "success": true,
  "message": "Student retrieved",
  "data": {
    "id": "uuid",
    "name": "Rahul Sharma",
    "parentMobile": "9876543212",
    "class": { "id": "uuid", "name": "Class 8" },
    "address": "123 Main Street, Delhi",
    "joiningDate": "2024-04-01T00:00:00.000Z",
    "fees": [
      {
        "id": "uuid",
        "month": "April",
        "year": 2024,
        "amount": 1500,
        "status": "paid",
        "paidDate": "2024-04-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### GET /students/:id/attendance
Get student attendance statistics.

**Access:** Authenticated (Institute, Teacher)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| month | integer | Month number (1-12) |
| year | integer | Year (e.g., 2024) |

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance stats retrieved",
  "data": {
    "attended": 22,
    "total": 25,
    "percentage": 88
  }
}
```

---

### PUT /students/:id
Update student.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "name": "Rahul Kumar Sharma",
  "parentMobile": "9876543213",
  "classId": "uuid",
  "address": "456 New Street, Delhi"
}
```

---

### DELETE /students/:id
Soft delete student.

**Access:** Authenticated (Institute only)

---

### GET /students/trash
Get soft-deleted students.

**Access:** Authenticated (Institute only)

---

### POST /students/:id/restore
Restore soft-deleted student.

**Access:** Authenticated (Institute only)

---

### DELETE /students/:id/permanent
Permanently delete student.

**Access:** Authenticated (Institute only)

---

## 7. Attendance

### POST /attendance
Mark attendance for students.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "classId": "uuid",
  "date": "2024-04-25",
  "records": [
    { "studentId": "uuid", "status": "present" },
    { "studentId": "uuid", "status": "absent" },
    { "studentId": "uuid", "status": "late" }
  ]
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| classId | string (UUID) | Yes | Class UUID |
| date | string (ISO date) | No | Date (default: today) |
| records | array | Yes | Attendance records |
| records[].studentId | string (UUID) | Yes | Student UUID |
| records[].status | string | Yes | "present", "absent", or "late" |

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": [
    { "studentId": "uuid", "name": "Rahul Sharma", "status": "present" },
    { "studentId": "uuid", "name": "Priya Singh", "status": "absent" },
    { "studentId": "uuid", "name": "Amit Verma", "status": "late" }
  ]
}
```

---

### GET /attendance/class
Get class attendance for a date.

**Access:** Authenticated (Institute, Teacher)

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| classId | string (UUID) | Yes | Class UUID |
| date | string (ISO date) | No | Date (default: today) |

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance retrieved",
  "data": [
    { "studentId": "uuid", "name": "Rahul Sharma", "status": "present" },
    { "studentId": "uuid", "name": "Priya Singh", "status": "absent" }
  ]
}
```

---

### GET /attendance/class/date
Get class attendance for a specific date.

**Access:** Authenticated (Institute, Teacher)

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| classId | string (UUID) | Yes | Class UUID |
| date | string (ISO date) | No | Date (default: today) |

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance retrieved",
  "data": [
    { "studentId": "uuid", "name": "Rahul Sharma", "status": "present" },
    { "studentId": "uuid", "name": "Priya Singh", "status": "absent" }
  ]
}
```

---

### GET /attendance/student
Get student attendance records.

**Access:** Authenticated (Institute, Teacher)

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| studentId | string (UUID) | Yes | Student UUID |
| month | integer | No | Month (default: current month) |
| year | integer | No | Year (default: current year) |

**Response (200):**
```json
{
  "success": true,
  "message": "Student attendance retrieved",
  "data": {
    "attended": 22,
    "total": 25,
    "percentage": 88
  }
}
```

---

## 8. Fees

### POST /fees
Create fee record.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "studentId": "uuid",
  "month": "April",
  "year": 2024,
  "amount": 1500,
  "status": "pending",
  "paymentMode": "cash"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| studentId | string (UUID) | Yes | Student UUID |
| month | string | Yes | Month name (e.g., "April") |
| year | integer | Yes | Year (e.g., 2024) |
| amount | integer | No | Amount (auto from class if not provided) |
| status | string | No | "pending" (default) or "paid" |
| paymentMode | string | No | "cash", "upi", or "bank" |

---

### POST /fees/generate
Generate monthly fees for all students in the institute.

**Access:** Authenticated (Institute only)

---

### POST /fees/generate-advance
Generate advance fees.

**Access:** Authenticated (Institute only)

---

### GET /fees
Get all fees with filters.

**Access:** Authenticated (Institute only)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| classId | string (UUID) | Filter by class |
| status | string | Filter by status ("paid", "pending") |
| month | string | Filter by month |
| year | integer | Filter by year |

---

### GET /fees/stats
Get fee statistics.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Fee stats retrieved",
  "data": {
    "collected": 120000,
    "pending": 18000,
    "pendingCount": 12,
    "totalStudents": 142
  }
}
```

---

### GET /fees/class-wise
Get class-wise fee summary.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Class-wise fees retrieved",
  "data": [
    {
      "classId": "uuid",
      "name": "Class 8",
      "subject": "Science",
      "monthlyFee": 1500,
      "studentCount": 28,
      "paidCount": 24,
      "pendingCount": 4
    }
  ]
}
```

---

### GET /fees/student/:studentId
Get student fee history.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Fee history retrieved",
  "data": [
    {
      "id": "uuid",
      "month": "April",
      "year": 2024,
      "amount": 1500,
      "status": "paid",
      "paidDate": "2024-04-01T00:00:00.000Z",
      "paymentMode": "cash"
    },
    {
      "id": "uuid",
      "month": "March",
      "year": 2024,
      "amount": 1500,
      "status": "paid",
      "paidDate": "2024-03-02T00:00:00.000Z",
      "paymentMode": "upi"
    }
  ]
}
```

---

### GET /fees/class/:classId
Get fees by class.

**Access:** Authenticated (Institute only)

---

### PUT /fees/:id/payment
Record payment for fee.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "paymentMode": "upi"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment recorded",
  "data": {
    "id": "uuid",
    "status": "paid",
    "paidDate": "2024-04-05T10:00:00.000Z",
    "paymentMode": "upi"
  }
}
```

---

## 9. Syllabus

**Audit Trail:** All create/update operations on syllabus, subjects, and topics automatically record `createdBy` and `updatedBy` fields containing `{ userId, name, role }`. This allows the admin to see who made what changes.

### POST /syllabus
Add syllabus topic.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "classId": "uuid",
  "name": "Chapter 1: Force & Motion",
  "status": "pending"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| classId | string (UUID) | Yes | Class UUID |
| name | string | Yes | Topic/chapter name |
| status | string | No | "pending" (default), "ongoing", or "done" |

**Response (201):**
```json
{
  "success": true,
  "message": "Syllabus created",
  "data": {
    "id": "uuid",
    "name": "Chapter 1: Force & Motion",
    "status": "pending",
    "classId": "uuid",
    "createdBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" },
    "updatedBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" },
    "createdAt": "2024-04-05T10:00:00.000Z",
    "updatedAt": "2024-04-05T10:00:00.000Z"
  }
}
```

---

### GET /syllabus/class/:classId
Get class syllabus with progress.

**Access:** Authenticated (Institute, Teacher)

**Response (200):**
```json
{
  "success": true,
  "message": "Syllabus retrieved",
  "data": {
    "syllabi": [
      {
        "id": "uuid",
        "name": "Chapter 1: Force & Motion",
        "status": "done",
        "classId": "uuid",
        "createdBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" },
        "updatedBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" },
        "createdAt": "2024-04-01T00:00:00.000Z",
        "updatedAt": "2024-04-05T10:00:00.000Z",
        "subjects": [
          {
            "id": "uuid",
            "name": "Physics",
            "status": "ongoing",
            "createdBy": { "userId": "uuid", "name": "Admin", "role": "institute" },
            "updatedBy": { "userId": "uuid", "name": "Admin", "role": "institute" },
            "topics": [
              {
                "id": "uuid",
                "name": "Newton's Laws",
                "isCompleted": true,
                "createdBy": { "userId": "uuid", "name": "Admin", "role": "institute" },
                "updatedBy": { "userId": "uuid", "name": "Admin", "role": "institute" }
              }
            ]
          }
        ]
      }
    ],
    "stats": {
      "total": 10,
      "done": 5,
      "ongoing": 3,
      "pending": 2,
      "percentage": 50
    }
  }
}
```

---

### GET /syllabus/:id
Get syllabus by ID.

**Access:** Authenticated (Institute, Teacher)

---

### PUT /syllabus/:id
Update syllabus topic.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "name": "Chapter 1: Force & Motion (Updated)",
  "status": "done"
}
```

---

### DELETE /syllabus/:id
Delete syllabus topic.

**Access:** Authenticated (Institute, Teacher)

---

### POST /syllabus/:syllabusId/subjects
Add subject to syllabus.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "name": "Physics",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Subject added",
  "data": {
    "id": "uuid",
    "name": "Physics",
    "status": "pending",
    "syllabusId": "uuid",
    "createdBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" },
    "updatedBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" }
  }
}
```

---

### PUT /syllabus/subjects/:subjectId
Update subject.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "name": "Advanced Physics",
  "status": "done"
}
```

---

### DELETE /syllabus/subjects/:subjectId
Delete subject (also deletes its topics).

**Access:** Authenticated (Institute, Teacher)

---

### POST /syllabus/subjects/:subjectId/topics
Add topic to subject.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "name": "Newton's Laws",
  "isCompleted": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Topic added",
  "data": {
    "id": "uuid",
    "name": "Newton's Laws",
    "isCompleted": false,
    "subjectId": "uuid",
    "createdBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" },
    "updatedBy": { "userId": "uuid", "name": "Ramesh Kumar", "role": "teacher" }
  }
}
```

---

### PUT /syllabus/topics/:topicId
Update topic.

**Access:** Authenticated (Institute, Teacher)

**Request:**
```json
{
  "name": "Newton's Laws of Motion",
  "isCompleted": true
}
```

---

### DELETE /syllabus/topics/:topicId
Delete topic.

**Access:** Authenticated (Institute, Teacher)

---

## 10. Homework

### POST /homework
Add homework.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "classId": "uuid",
  "title": "Chapter 3 Questions",
  "description": "Solve Questions 1 to 10 from page 45",
  "dueDate": "2024-04-26"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| classId | string (UUID) | Yes | Class UUID |
| title | string | Yes | Homework title |
| description | string | No | Homework details |
| dueDate | string (ISO date) | No | Due date |

---

### GET /homework/class/:classId
Get class homework.

**Access:** Authenticated (Institute only)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status ("active", "completed") |

**Response (200):**
```json
{
  "success": true,
  "message": "Homeworks retrieved",
  "data": [
    {
      "id": "uuid",
      "title": "Chapter 3 Questions",
      "description": "Solve Questions 1 to 10",
      "dueDate": "2024-04-26T00:00:00.000Z",
      "status": "active",
      "submittedCount": 22,
      "pendingCount": 6
    }
  ]
}
```

---

### GET /homework/:id
Get homework details with submissions.

**Access:** Authenticated (Institute only)

**Response (200):**
```json
{
  "success": true,
  "message": "Homework retrieved",
  "data": {
    "id": "uuid",
    "title": "Chapter 3 Questions",
    "description": "Solve Questions 1 to 10",
    "dueDate": "2024-04-26T00:00:00.000Z",
    "status": "active",
    "submittedCount": 22,
    "pendingCount": 6,
    "submissions": [
      {
        "id": "uuid",
        "status": "submitted",
        "submittedAt": "2024-04-25T10:00:00.000Z",
        "student": { "id": "uuid", "name": "Rahul Sharma" }
      }
    ]
  }
}
```

---

### PUT /homework/:id
Update homework.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "dueDate": "2024-04-27",
  "status": "completed"
}
```

---

### DELETE /homework/:id
Delete homework.

**Access:** Authenticated (Institute only)

---

### POST /homework/submit
Submit homework by student.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "homeworkId": "uuid",
  "studentId": "uuid"
}
```

---

## 11. Notices

### POST /notices
Create notice.

**Access:** Authenticated (Institute only)

**Request:**
```json
{
  "title": "Holiday Notice",
  "message": "Coaching will remain closed on 25 April due to local holiday.",
  "type": "holiday",
  "priority": "high",
  "classId": null
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Notice title |
| message | string | Yes | Notice content |
| type | string | No | "general", "urgent", "fee", "holiday" |
| priority | string | No | "normal", "high", "low" |
| classId | string (UUID) | No | null = all classes, uuid = specific class |

---

### GET /notices
Get all notices.

**Access:** Authenticated (Institute only)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| classId | string (UUID) | Filter by class |

**Response (200):**
```json
{
  "success": true,
  "message": "Notices retrieved",
  "data": [
    {
      "id": "uuid",
      "title": "Holiday Notice",
      "message": "Coaching will remain closed on 25 April",
      "type": "holiday",
      "priority": "high",
      "classId": null,
      "createdAt": "2026-04-05T10:00:00.000Z"
    }
  ]
}
```

---

### GET /notices/:id
Get notice by ID.

**Access:** Authenticated (Institute only)

---

### PUT /notices/:id
Update notice.

**Access:** Authenticated (Institute only)

---

### DELETE /notices/:id
Delete notice.

**Access:** Authenticated (Institute only)

---

## 12. Parent Portal

All parent endpoints require authentication (parent role).

### GET /parent/children
Get parent's linked children.

---

### GET /parent/children/:studentId/attendance
Get child attendance.

---

### GET /parent/children/:studentId/fees
Get child fee history.

---

### GET /parent/children/:studentId/syllabus
Get child syllabus.

---

### PUT /parent/profile
Update parent profile.

---

## 13. Role-Based Access Summary

| Resource | Institute (Admin) | Teacher |
|----------|:-:|:-:|
| Auth (login/register) | ✅ | ✅ (via `/teachers/login`) |
| Profile (me/update) | ✅ | ✅ |
| **Classes** | **Full CRUD** | **Read only** (GET list, GET by id) |
| **Students** | **Full CRUD** | **Read only** (GET list, GET by id, GET attendance stats) |
| **Attendance** | **Full** | **Full** (mark + view) |
| **Syllabus** | **Full CRUD** | **Full CRUD** (with audit trail) |
| Teachers | Full CRUD | ❌ |
| Fees | Full CRUD | ❌ |
| Homework | Full CRUD | ❌ |
| Notices | Full CRUD | ❌ |
| Dashboard | Full | ❌ |
| Parent Portal | ❌ | ❌ |

---

## 14. Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
| Code | Description | Example |
|------|-------------|---------|
| 200 | Success | Login successful |
| 201 | Created | Student added |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid/expired token |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Mobile already registered |
| 500 | Server Error | Internal error |

### Validation Error Response (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "mobile", "message": "Mobile must be 10 digits" },
    { "field": "password", "message": "Password is required" }
  ]
}
```

### Forbidden Error Response (403)
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

---

## 15. Environment Variables

### Development (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=file:./dev.db
JWT_SECRET=your-development-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Production (.env)
```env
PORT=3000
NODE_ENV=production
DATABASE_URL=file:./prod.db
JWT_SECRET=very-long-random-secret-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
```
