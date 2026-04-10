# VidyaTrack API Documentation

## Base URL
```
Production: https://your-domain.com/api/v1
Development: http://localhost:3000/api/v1
```

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [User Profile](#2-user-profile)
3. [Dashboard](#3-dashboard)
4. [Classes](#4-classes)
5. [Teachers](#5-teachers)
6. [Students](#6-students)
7. [Attendance](#7-attendance)
8. [Fees](#8-fees)
9. [Syllabus](#9-syllabus)
10. [Homework](#10-homework)
11. [Notices](#11-notices)
12. [Error Handling](#12-error-handling)

---

## 1. Authentication

### POST /auth/register
Register a new user (Institute or Teacher).

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
Login with mobile and password.

**Request:**
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| mobile | string | Yes | 10 digit mobile number |
| password | string | Yes | User password |

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

### POST /auth/logout
Logout user (invalidate tokens).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## 2. User Profile

### GET /auth/me
Get current logged-in user profile.

**Headers:** `Authorization: Bearer <token>`

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

## 3. Dashboard

### GET /dashboard/stats
Get dashboard statistics.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

## 4. Classes

### POST /classes
Create a new class.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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
Delete class (soft delete).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Class deleted",
  "data": null
}
```

---

### GET /classes/stats
Get class statistics.

**Headers:** `Authorization: Bearer <token>`

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

## 5. Teachers

### POST /teachers
Add a new teacher.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "teacherName": "Ramesh Kumar",
  "joiningDate": "2024-04-01",
  "subject": "Science",
  "mobile": "9876543211",
  "qualification": "M.Sc",
  "email": "ramesh@example.com"
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
    "isActive": true
  }
}
```

---

### GET /teachers
Get all teachers.

**Headers:** `Authorization: Bearer <token>`

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
      "_count": { "classes": 2 }
    }
  ]
}
```

---

### GET /teachers/:id
Get teacher details.

**Headers:** `Authorization: Bearer <token>`

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
    "classes": [
      { "id": "uuid", "name": "Class 8", "subject": "Science" }
    ]
  }
}
```

---

### PUT /teachers/:id
Update teacher.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "teacherName": "Ramesh Kumar Sir",
  "subject": "Physics",
  "qualification": "M.Phil",
  "email": "ramesh.kumar@example.com"
}
```

---

### DELETE /teachers/:id
Delete teacher.

**Headers:** `Authorization: Bearer <token>`

---

## 6. Students

### POST /students
Add a new student.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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
Delete student (soft delete).

**Headers:** `Authorization: Bearer <token>`

---

## 7. Attendance

### POST /attendance
Mark attendance for students.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

### GET /attendance/class/stats
Get class attendance statistics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| classId | string (UUID) | Yes | Class UUID |
| month | integer | No | Month (default: current month) |
| year | integer | No | Year (default: current year) |

**Response (200):**
```json
{
  "success": true,
  "message": "Class attendance stats retrieved",
  "data": {
    "present": 22,
    "absent": 4,
    "late": 2
  }
}
```

---

### GET /attendance/student
Get student attendance records.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

### GET /fees
Get all fees with filters.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

### PUT /fees/:id/payment
Record payment for fee.

**Headers:** `Authorization: Bearer <token>`

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

### POST /syllabus
Add syllabus topic.

**Headers:** `Authorization: Bearer <token>`

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

---

### GET /syllabus/class/:classId
Get class syllabus with progress.

**Headers:** `Authorization: Bearer <token>`

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
        "createdAt": "2024-04-01T00:00:00.000Z"
      },
      {
        "id": "uuid",
        "name": "Chapter 2: Light & Shadow",
        "status": "ongoing",
        "createdAt": "2024-04-05T00:00:00.000Z"
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

### PUT /syllabus/:id
Update syllabus topic.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

---

## 10. Homework

### POST /homework
Add homework.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

---

### POST /homework/submit
Submit homework by student.

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

**Headers:** `Authorization: Bearer <token>`

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

---

### PUT /notices/:id
Update notice.

---

### DELETE /notices/:id
Delete notice.

---

## 12. Error Handling

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

---

## Frontend Implementation Guide

### Token Storage & Auto-Login

```javascript
// api.js - API Helper
const API_BASE = 'https://your-domain.com/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      // If unauthorized, try refresh token
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.token}`;
          return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        }
        // Logout if refresh failed
        this.logout();
        window.location.href = '/login';
      }

      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.data.token;
        this.refreshToken = data.data.refreshToken;
        localStorage.setItem('token', this.token);
        localStorage.setItem('refreshToken', this.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth
  async login(mobile, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password })
    });
    const data = await response.json();
    if (data.success) {
      this.token = data.data.token;
      this.refreshToken = data.data.refreshToken;
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.success) {
      this.token = data.data.token;
      this.refreshToken = data.data.refreshToken;
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }

  logout() {
    this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Dashboard
  async getDashboardStats() {
    const response = await this.request('/dashboard/stats');
    return response.json();
  }

  async getDashboardOverview() {
    const response = await this.request('/dashboard/overview');
    return response.json();
  }

  // Classes
  async getClasses() {
    const response = await this.request('/classes');
    return response.json();
  }

  async createClass(data) {
    const response = await this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateClass(id, data) {
    const response = await this.request(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deleteClass(id) {
    const response = await this.request(`/classes/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Students
  async getStudents(classId = null) {
    let url = '/students';
    if (classId) url += `?classId=${classId}`;
    const response = await this.request(url);
    return response.json();
  }

  async createStudent(data) {
    const response = await this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Attendance
  async markAttendance(data) {
    const response = await this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getClassAttendance(classId, date) {
    const response = await this.request(`/attendance/class?classId=${classId}&date=${date}`);
    return response.json();
  }

  // Fees
  async getFeeStats() {
    const response = await this.request('/fees/stats');
    return response.json();
  }

  async recordPayment(feeId, paymentMode) {
    const response = await this.request(`/fees/${feeId}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentMode })
    });
    return response.json();
  }
}

export const api = new ApiClient();
```

### App Initialization (Auto-Login)

```javascript
// app.js
import { api } from './api';

async function initApp() {
  // Check if user is logged in
  if (api.token && api.refreshToken) {
    try {
      // Verify token is still valid
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${api.token}` }
      });

      if (response.ok) {
        // Token is valid, proceed to dashboard
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.data));
        showDashboard();
      } else if (response.status === 401) {
        // Try refresh token
        const refreshed = await api.refreshAccessToken();
        if (refreshed) {
          showDashboard();
        } else {
          showLogin();
        }
      } else {
        showLogin();
      }
    } catch (error) {
      console.error('Init error:', error);
      showLogin();
    }
  } else {
    showLogin();
  }
}

initApp();
```

### Login Screen

```javascript
async function handleLogin() {
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;

  const result = await api.login(mobile, password);

  if (result.success) {
    showDashboard();
  } else {
    alert(result.message);
  }
}
```

### Logout

```javascript
function handleLogout() {
  api.logout();
  showLogin();
}
```

---

## Environment Variables

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
