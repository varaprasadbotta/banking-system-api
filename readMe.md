# 🏦 Banking System API

A RESTful Banking System API built with **Node.js**, **Express**, **TypeScript**, and **MySQL**. This API provides complete banking functionality including user authentication, account management, and financial transactions (deposits, withdrawals, and transfers).

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Architecture Overview](#-architecture-overview)
- [Error Handling](#-error-handling)

---

## 🛠 Tech Stack

| Technology      | Purpose                              |
| --------------- | ------------------------------------ |
| **Node.js**     | JavaScript runtime environment       |
| **Express 5**   | Web framework for building REST APIs |
| **TypeScript**  | Type-safe JavaScript superset        |
| **MySQL**       | Relational database                  |
| **mysql2**      | MySQL client with connection pooling |
| **JWT**         | Authentication via JSON Web Tokens   |
| **bcrypt**      | Password hashing                     |
| **Zod**         | Runtime request validation           |
| **dotenv**      | Environment variable management      |
| **ts-node-dev** | Development server with hot-reload   |

---

## DB Schema (MYSQL)

```
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

```

CREATE TABLE accounts (
id INT PRIMARY KEY AUTO_INCREMENT,

    account_number VARCHAR(20) NOT NULL UNIQUE,

    account_type ENUM(
        'SAVINGS',
        'CURRENT',
        'SALARY'
    ) NOT NULL,

    balance DECIMAL(15,2) NOT NULL DEFAULT 0,

    user_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)

);

````

CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,

  from_account_id INT NULL,

  to_account_id INT NULL,

  transaction_type ENUM(
      'DEPOSIT',
      'WITHDRAW',
      'TRANSFER'
  ) NOT NULL,

  amount DECIMAL(15,2) NOT NULL,

  description VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (from_account_id)
      REFERENCES accounts(id),

  FOREIGN KEY (to_account_id)
      REFERENCES accounts(id)
);




## ✨ Features

### Authentication
- User registration with email uniqueness check
- Secure login with JWT token generation (24h expiry)
- Password hashing with bcrypt (10 salt rounds)
- Protected route access via Bearer token middleware
- User profile retrieval

### Account Management
- Create bank accounts (Savings, Current, Salary)
- **One account per type** — users cannot create duplicate account types
- View all accounts for the authenticated user
- View individual account details with ownership verification

### Transactions
- **Deposit** — Add funds to an account by account number
- **Withdraw** — Withdraw funds with balance validation
- **Transfer** — Transfer funds between accounts using database transactions with rollback support
- Ownership verification on all transaction operations
- Transaction history logging in the database

---
## 📁 Project Structure

```text
banking-system-api/
├── dist/                          # Compiled JavaScript output (after build)
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment variable configuration
│   ├── constants/
│   │   └── http-status.ts         # HTTP status code constants
│   ├── controllers/               # Request handlers (parse req → call service → send res)
│   │   ├── account.controller.ts  # Create Account, Get Accounts, Get Account
│   │   ├── auth.controller.ts     # Register, Login, Profile
│   │   └── transaction.controller.ts # Deposit, Withdraw, Transfer
│   ├── db/
│   │   ├── mysql.ts               # MySQL connection pool configuration
│   │   └── test-db-connection.ts  # Database connectivity check on startup
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT authentication guard
│   │   └── error.middleware.ts    # Global error handler
│   ├── repositories/              # Database access layer (raw SQL queries)
│   │   ├── account.repository.ts  # Account CRUD + transaction-safe variants
│   │   ├── transaction.repository.ts # Transaction record creation
│   │   └── user.repository.ts     # User CRUD operations
│   ├── routes/                    # Route definitions
│   │   ├── account.routes.ts      # /api/v1/accounts/_
│   │   ├── auth.routes.ts         # /api/v1/auth/_
│   │   └── transaction.routes.ts  # /api/v1/accounts/:id/deposit, /api/v1/transactions/*, /api/v1/transfer
│   ├── services/                  # Business logic layer
│   │   ├── account.service.ts     # Account creation with duplicate check
│   │   ├── auth.service.ts        # Registration, login, profile logic
│   │   └── transaction.service.ts # Deposit, withdraw, transfer with validations
│   ├── types/                     # TypeScript interfaces & type declarations
│   │   ├── express/               # Express type augmentation (req.user)
│   │   ├── account.types.ts       # Account & payload interfaces
│   │   ├── auth.types.ts          # Auth-related interfaces
│   │   ├── transaction.types.ts   # Transaction payload interfaces
│   │   └── user.types.ts          # User interface
│   ├── utils/
│   │   ├── app-error.ts           # Custom AppError class with status codes
│   │   └── response.ts            # Standardized success/error response helpers
│   ├── validators/                # Zod request body schemas
│   │   ├── account.validator.ts   # Create account, deposit, withdraw schemas
│   │   ├── auth.validator.ts      # Register & login schemas
│   │   └── transaction.validator.ts # Transfer schema
│   ├── app.ts                     # Express app setup, middleware & route mounting
│   └── server.ts                  # Server entry point, DB connection & startup
├── .env                           # Environment variables (not committed)
├── .gitignore
├── package.json
├── readMe.md
└── tsconfig.json
````

---

## 📌 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (v8.0 or higher) — [Download](https://dev.mysql.com/downloads/)

---

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/banking-system-api.git
cd banking-system-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following variables (see [Environment Variables](#-environment-variables) for details):

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=banking_system
```

### Step 4: Create the Database

Log into MySQL and create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE banking_system;
USE banking_system;
```

### Step 5: Create Tables

Run the following SQL to create the required tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_number VARCHAR(50) NOT NULL UNIQUE,
  account_type ENUM('SAVINGS', 'CURRENT', 'SALARY') NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_account_id INT,
  to_account_id INT,
  transaction_type ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);
```

### Step 6: Start the Development Server

```bash
npm run dev
```

You should see:

```
✅ Database connected successfully
🚀 Banking System API running on port 5000
```

---

## 🔐 Environment Variables

| Variable      | Description                | Default       |
| ------------- | -------------------------- | ------------- |
| `NODE_ENV`    | Application environment    | `development` |
| `PORT`        | Server port                | `5000`        |
| `JWT_SECRET`  | Secret key for JWT signing | —             |
| `DB_HOST`     | MySQL host                 | —             |
| `DB_PORT`     | MySQL port                 | `3306`        |
| `DB_USER`     | MySQL username             | —             |
| `DB_PASSWORD` | MySQL password             | —             |
| `DB_NAME`     | MySQL database name        | —             |

---

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### Health Check

| Method | Endpoint  | Description             | Auth |
| ------ | --------- | ----------------------- | ---- |
| GET    | `/health` | Check if API is running | ❌   |

---

### 🔑 Authentication — `/api/v1/auth`

| Method | Endpoint    | Description             | Auth |
| ------ | ----------- | ----------------------- | ---- |
| POST   | `/register` | Register a new user     | ❌   |
| POST   | `/login`    | Login & get JWT token   | ❌   |
| GET    | `/profile`  | Get logged-in user info | ✅   |

#### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1
  }
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile

```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-31T06:00:00.000Z"
  }
}
```

---

### 🏦 Accounts — `/api/v1/accounts`

> All account endpoints require authentication via Bearer token.

| Method | Endpoint          | Description                   | Auth |
| ------ | ----------------- | ----------------------------- | ---- |
| POST   | `/create-account` | Create a new bank account     | ✅   |
| GET    | `/my-accounts`    | Get all accounts for the user | ✅   |
| GET    | `/:accountId`     | Get single account details    | ✅   |

#### Create Account

```http
POST /api/v1/accounts/create-account
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountType": "SAVINGS"
}
```

> **Allowed values:** `SAVINGS`, `CURRENT`, `SALARY`
>
> ⚠️ Each user can only have **one account per type**.

**Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "accountId": 1,
    "accountNumber": "ACC1780221479278"
  }
}
```

#### Get My Accounts

```http
GET /api/v1/accounts/my-accounts
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Accounts fetched successfully",
  "data": [
    {
      "id": 1,
      "accountNumber": "ACC1780221479278",
      "accountType": "SAVINGS",
      "balance": 10000
    }
  ]
}
```

#### Get Account by ID

```http
GET /api/v1/accounts/1
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account fetched successfully",
  "data": {
    "id": 1,
    "accountNumber": "ACC1780221479278",
    "accountType": "SAVINGS",
    "balance": 10000
  }
}
```

---

### 💸 Transactions — `/api/v1`

> All transaction endpoints require authentication via Bearer token.

| Method | Endpoint                           | Description                     | Auth |
| ------ | ---------------------------------- | ------------------------------- | ---- |
| POST   | `/accounts/:accountNumber/deposit` | Deposit money into an account   | ✅   |
| POST   | `/transactions/withdraw`           | Withdraw money from an account  | ✅   |
| POST   | `/transfer`                        | Transfer money between accounts | ✅   |

#### Deposit

```http
POST /api/v1/accounts/ACC1780221479278/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Amount deposited successfully",
  "data": {
    "accountNumber": "ACC1780221479278",
    "depositedAmount": 5000,
    "newBalance": 15000
  }
}
```

#### Withdraw

```http
POST /api/v1/transactions/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountNumber": "ACC1780221479278",
  "amount": 2000
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Amount withdrawn successfully",
  "data": {
    "accountNumber": "ACC1780221479278",
    "withdrawnAmount": 2000,
    "newBalance": 13000
  }
}
```

#### Transfer

```http
POST /api/v1/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "fromAccountNumber": "ACC1780221479278",
  "toAccountNumber": "ACC1780209030570",
  "amount": 5000
}
```

> ⚠️ The `fromAccountNumber` must belong to the authenticated user. Transfers use **database transactions** with automatic rollback on failure.

**Response (200):**

```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "message": "Transfer successful"
  }
}
```

---

## 🏗 Architecture Overview

This project follows a **layered architecture** pattern:

```
Request → Routes → Controllers → Services → Repositories → Database
                                                    ↓
                                              MySQL (mysql2)
```

| Layer            | Responsibility                                                        |
| ---------------- | --------------------------------------------------------------------- |
| **Routes**       | Define HTTP endpoints and attach middleware (auth, validation)        |
| **Controllers**  | Parse requests, call services, and send standardized HTTP responses   |
| **Services**     | Contain business logic, validations, and orchestrate repository calls |
| **Repositories** | Execute raw SQL queries against MySQL via connection pool             |
| **Middleware**   | Cross-cutting concerns — JWT auth guard, global error handler         |
| **Validators**   | Zod schemas for runtime request body validation                       |
| **Types**        | TypeScript interfaces for type safety across all layers               |
| **Utils**        | Shared utilities — custom `AppError` class, response helpers          |

---

## ⚠️ Error Handling

All errors follow a consistent JSON format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning                                             |
| ----------- | --------------------------------------------------- |
| `400`       | Bad Request — validation errors, insufficient funds |
| `401`       | Unauthorized — missing/invalid JWT token            |
| `403`       | Forbidden — accessing another user's resource       |
| `404`       | Not Found — account/user doesn't exist              |
| `409`       | Conflict — duplicate email or account type          |
| `500`       | Internal Server Error — unexpected failures         |

---

## 📦 Available Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start development server with hot-reload   |
| `npm run build` | Compile TypeScript to JavaScript (`dist/`) |
| `npm start`     | Run the compiled production build          |

---

## 📝 License

ISC

---

## 👤 Author

**Prasad Botta**
