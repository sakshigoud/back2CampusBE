# Back2Campus API

A Node.js REST API for managing alumni networks, connecting graduates with their institutions through announcements, profiles, and departmental organization.

## 🚀 Features

- **Alumni Management**: Registration, authentication, and profile management
- **Department Organization**: Create and manage academic departments
- **Announcements**: Create and share announcements with alumni network
- **JWT Authentication**: Secure authentication system
- **Input Validation**: Comprehensive data validation
- **Pagination**: Efficient data retrieval with pagination support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.0 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone 
   cd back2campus-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/back2campus
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Optional: If using MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/back2campus
   ```

4. **Database Setup**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or if using MongoDB as a service
   sudo systemctl start mongod
   ```

5. **Start the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:3000/health
   ```

## 📁 Project Structure

```
back2campus-api/
├── controllers/         # Route controllers
├── models/             # Database models
├── routes/             # API routes
├── middleware/         # Custom middleware
├── config/             # Configuration files
├── utils/              # Utility functions
├── tests/              # Test files
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies
└── server.js           # Application entry point
```

## 🔧 Scripts

```bash
# Start the server
npm start

# Start with nodemon (development)
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Check test coverage
npm run coverage
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description of the operation",
  "data": {}, // Response data (object or array)
  "errors": [] // Validation errors (if any)
}
```

---

## 🔐 Authentication

### Register Alumni
**POST** `/api/auth/register`

Register a new alumni account.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "batch": "2020-2024",
    "department": "DEPARTMENT_ID_HERE",
    "job_title": "Software Engineer",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Full name of the alumni |
| batch | string | Yes | Graduation batch (e.g., "2020-2024") |
| department | string | Yes | Department ID |
| job_title | string | Yes | Current job title |
| email | string | Yes | Email address (must be unique) |
| phone | string | Yes | Phone number |
| password | string | Yes | Password (min 6 characters) |

### Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

### Get Profile
**GET** `/api/auth/profile` 🔒

Get current user's profile information.

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update Profile
**PUT** `/api/auth/profile` 🔒

Update current user's profile.

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "job_title": "Senior Software Engineer",
    "phone": "+1234567891"
  }'
```

---

## 🏢 Departments

### Get All Departments
**GET** `/api/departments`

Retrieve all departments.

```bash
curl -X GET http://localhost:3000/api/departments
```

### Create Department
**POST** `/api/departments`

Create a new department.

```bash
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "code": "CS"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Department name |
| code | string | Yes | Department code (unique) |

---

## 📢 Announcements

### Get All Announcements
**GET** `/api/announcements`

Retrieve announcements with pagination.

```bash
# Basic request
curl -X GET http://localhost:3000/api/announcements

# With pagination
curl -X GET "http://localhost:3000/api/announcements?page=1&limit=5"
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| sort | string | created_at | Sort field |

### Get Announcement by ID
**GET** `/api/announcements/:id`

Retrieve a specific announcement.

```bash
curl -X GET http://localhost:3000/api/announcements/ANNOUNCEMENT_ID_HERE
```

### Create Announcement
**POST** `/api/announcements` 🔒

Create a new announcement (requires authentication).

```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Alumni Meet 2024",
    "description": "Join us for our annual alumni meet on December 15th, 2024."
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Announcement title |
| description | string | Yes | Announcement description |

---

## 🧪 Testing the API

### Quick Setup Flow

1. **Create a Department**
   ```bash
   curl -X POST http://localhost:3000/api/departments \
     -H "Content-Type: application/json" \
     -d '{"name": "Computer Science", "code": "CS"}'
   ```

2. **Register an Alumni** (use department ID from step 1)
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Jane Smith",
       "batch": "2019-2023",
       "department": "REPLACE_WITH_DEPARTMENT_ID",
       "job_title": "Full Stack Developer",
       "email": "jane.smith@example.com",
       "phone": "+1987654321",
       "password": "securepass123"
     }'
   ```

3. **Login to get JWT token**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "jane.smith@example.com",
       "password": "securepass123"
     }'
   ```

4. **Create an Announcement** (use JWT token from step 3)
   ```bash
   curl -X POST http://localhost:3000/api/announcements \
     -H "Authorization: Bearer REPLACE_WITH_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Tech Talk: AI in Modern Development",
       "description": "Join us for an exciting tech talk about AI."
     }'
   ```

### Health Check
```bash
curl -X GET http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running successfully",
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": "5m 30s"
  }
}
```

## 🔒 Authentication Notes

- 🔒 indicates protected routes requiring JWT authentication
- Include JWT token in the `Authorization` header: `Bearer YOUR_JWT_TOKEN`
- Tokens expire based on `JWT_EXPIRES_IN` environment variable
- Invalid or expired tokens return `401 Unauthorized`

## ❌ Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

```