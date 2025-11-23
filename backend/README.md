# HRMS Backend API

A comprehensive Human Resource Management System backend built with Node.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing with Postman](#testing-with-postman)

## ✨ Features

- **Multi-tenant Architecture**: Support for multiple organizations
- **Authentication & Authorization**: JWT-based secure authentication
- **Employee Management**: Complete CRUD operations for employees
- **Team Management**: Create and manage teams with employee assignments
- **Activity Logging**: Track all system activities for audit purposes
- **RESTful API**: Clean and well-structured API endpoints

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv
- **CORS**: cors

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create PostgreSQL Database

Open PostgreSQL and create a new database:

```sql
CREATE DATABASE hrms_db;
```

## ⚙️ Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

### 2. Add Environment Variables

Add the following configuration to your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Important**: Replace the following values:
- `DB_USER`: Your PostgreSQL username (default: `postgres`)
- `DB_PASSWORD`: Your PostgreSQL password
- `JWT_SECRET`: A strong, unique secret key for production

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode

```bash
NODE_ENV=production npm start
```

### Verify Server is Running

You should see:
```
Database synced successfully
Database connected hrms_db
Server running on port 5000
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register Organisation
Create a new organisation with an admin user.

```http
POST /api/auth/register
Content-Type: application/json

{
  "orgName": "Innovatech Inc.",
  "adminName": "Jane Doe",
  "email": "jane.doe@innovattech.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "Organisation and admin user created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "jane.doe@innovattech.com",
    "name": "Jane Doe",
    "organisationId": 1
  }
}
```

#### 2. Login
Authenticate and receive a JWT token.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane.doe@innovattech.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "jane.doe@innovattech.com",
    "name": "Jane Doe",
    "organisationId": 1
  }
}
```

### Employee Endpoints

**Note**: All employee endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

#### 3. Create Employee

```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@innovattech.com",
  "phone": "123-456-7890"
}
```

#### 4. Get All Employees

```http
GET /api/employees
Authorization: Bearer <token>
```

#### 5. Get Single Employee

```http
GET /api/employees/:id
Authorization: Bearer <token>
```

#### 6. Update Employee

```http
PUT /api/employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Johnathan",
  "phone": "987-654-3210"
}
```

#### 7. Delete Employee

```http
DELETE /api/employees/:id
Authorization: Bearer <token>
```

### Team Endpoints

#### 8. Create Team

```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Handles all product development."
}
```

#### 9. Get All Teams

```http
GET /api/teams
Authorization: Bearer <token>
```

#### 10. Get Single Team

```http
GET /api/teams/:id
Authorization: Bearer <token>
```

#### 11. Update Team

```http
PUT /api/teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "The core product development team."
}
```

#### 12. Delete Team

```http
DELETE /api/teams/:id
Authorization: Bearer <token>
```

### Team Assignment Endpoints

#### 13. Assign Employee to Team

```http
POST /api/teams/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamId": 1,
  "employeeId": 1
}
```

#### 14. Remove Employee from Team

```http
POST /api/teams/remove
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamId": 1,
  "employeeId": 1
}
```

### Activity Logs Endpoint

#### 15. Get All Activity Logs

```http
GET /api/logs
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "action": "user_logged_in",
    "meta": { "userId": 1 },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "organisation_id": 1,
    "user_id": 1,
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane.doe@innovattech.com"
    }
  }
]
```

## 🗄️ Database Schema

### Tables

1. **Organisations**
   - `id` (Primary Key)
   - `name`
   - `createdAt`
   - `updatedAt`

2. **Users**
   - `id` (Primary Key)
   - `name`
   - `email` (Unique)
   - `password` (Hashed)
   - `organisation_id` (Foreign Key)
   - `createdAt`
   - `updatedAt`

3. **Employees**
   - `id` (Primary Key)
   - `first_name`
   - `last_name`
   - `email` (Unique)
   - `phone`
   - `organisation_id` (Foreign Key)
   - `createdAt`
   - `updatedAt`

4. **Teams**
   - `id` (Primary Key)
   - `name`
   - `description`
   - `organisation_id` (Foreign Key)
   - `createdAt`
   - `updatedAt`

5. **TeamMembers** (Junction Table)
   - `team_id` (Foreign Key)
   - `employee_id` (Foreign Key)
   - Composite Primary Key

6. **ActivityLogs**
   - `id` (Primary Key)
   - `action`
   - `meta` (JSONB)
   - `timestamp`
   - `organisation_id` (Foreign Key)
   - `user_id` (Foreign Key)
   - `createdAt`
   - `updatedAt`

---