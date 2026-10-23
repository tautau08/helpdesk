# 🎫 Helpdesk

A full-stack customer service / IT helpdesk application for tracking errors, managing support tickets, and routing escalations — built with a **Spring Boot** REST API and a **Next.js** frontend.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [API Overview](#api-overview)
- [Environment Configuration](#environment-configuration)
- [Documentation](#documentation)

---

## Overview

Helpdesk is a two-tier web application that gives support teams a centralised place to:

- **Submit and track support tickets** with priorities, statuses, categories and subcategories
- **Manage organisational structure** — companies, departments, projects and users
- **Define escalation matrices** so unresolved tickets automatically escalate to the right team
- **Control access** through fine-grained, role-based permissions secured with JWT

---

## Architecture

```
┌────────────────────────┐        REST / JSON        ┌─────────────────────────┐
│   helpdesk_frontend    │  ◄──────────────────────► │       helpdesk          │
│   Next.js 15 (React)   │       (port 3000)          │  Spring Boot 3.5 API   │
│   TypeScript / TWC     │                            │      (port 8080)        │
└────────────────────────┘                            └──────────┬──────────────┘
                                                                 │
                                                    ┌────────────▼────────────┐
                                                    │      PostgreSQL DB       │
                                                    │      (port 5432)         │
                                                    └─────────────────────────┘
                                                                 │
                                                    ┌────────────▼────────────┐
                                                    │   Cloudinary (images)   │
                                                    └─────────────────────────┘
```

---

## Tech Stack

### Backend (`/helpdesk`)

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Spring Boot 3.5.7                   |
| Language     | Java 17                             |
| Security     | Spring Security + JWT (JJWT 0.12.5) |
| Persistence  | Spring Data JPA / Hibernate         |
| Database     | PostgreSQL                          |
| File Storage | Cloudinary                          |
| Utilities    | Lombok                              |
| Build        | Maven (mvnw wrapper included)       |

### Frontend (`/helpdesk_frontend`)

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | Next.js 15 (App Router)           |
| Language      | TypeScript 5                      |
| Styling       | Tailwind CSS 3                    |
| UI Primitives | Radix UI                          |
| Forms         | React Hook Form + Zod             |
| HTTP Client   | Axios                             |
| Toasts        | Sonner                            |

---

## Project Structure

```
helpdesk/                          ← monorepo root
├── helpdesk/                      ← Spring Boot backend
│   ├── src/main/java/com/example/helpdesk/
│   │   ├── config/                ← Security, JWT, DataInitializer
│   │   ├── controller/            ← REST controllers
│   │   ├── domain/                ← JPA entities
│   │   ├── dto/                   ← Request / Response DTOs
│   │   ├── repository/            ← Spring Data repositories
│   │   └── service/               ← Business logic
│   ├── src/main/resources/
│   │   └── application.properties ← DB, JWT & Cloudinary config
│   └── pom.xml
│
└── helpdesk_frontend/             ← Next.js frontend
    └── src/
        ├── app/
        │   ├── (auth)/            ← Login page
        │   └── (dashboard)/       ← Protected pages
        │       ├── dashboard/
        │       ├── tickets/
        │       ├── companies/
        │       ├── departments/
        │       ├── projects/
        │       ├── categories/
        │       ├── subcategories/
        │       ├── statuses/
        │       ├── priorities/
        │       ├── service-types/
        │       └── users/
        ├── components/            ← Shared UI components
        ├── contexts/              ← React contexts (auth, etc.)
        ├── hooks/                 ← Custom React hooks
        ├── lib/                   ← API client, utils
        └── types/                 ← TypeScript type definitions
```

---

## Features

- **Ticket Management** — create, update, and close support tickets with full audit trail
- **Categorisation** — categories, subcategories, priorities, statuses and service types
- **Escalation Matrices** — configurable escalation rules per project/priority
- **User & Role Management** — four built-in roles (SYSTEM, ADMIN, USER, VIEWER)
- **Company / Department / Project hierarchy** — multi-tenant organisational model
- **JWT Authentication** — stateless, token-based auth with 1-hour expiry
- **Image Uploads** — Cloudinary integration for ticket attachments
- **Auto-seeded test data** — default users and config created on first startup

---

## Getting Started

### Prerequisites

| Tool                   | Version |
|------------------------|---------|
| Java                   | 17+     |
| Maven (or use wrapper) | 3.9+    |
| Node.js                | 18+     |
| npm                    | 9+      |
| PostgreSQL             | 14+     |

### Backend Setup

1. **Create the database**

   ```sql
   CREATE USER helpdeskdb WITH PASSWORD 'helpdesk123';
   CREATE DATABASE helpdesk_db OWNER helpdeskdb;
   ```

2. **Configure** `helpdesk/src/main/resources/application.properties` (see [Environment Configuration](#environment-configuration))

3. **Run the backend**

   ```bash
   cd helpdesk
   ./mvnw spring-boot:run      # Linux / macOS
   mvnw.cmd spring-boot:run    # Windows
   ```

   The API starts at **http://localhost:8080**.  
   On first startup the database is seeded with default roles and test users (see [Authentication](#authentication)).

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd helpdesk_frontend
   npm install
   ```

2. **Set the API base URL** in `.env.local`

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   The frontend runs at **http://localhost:3000**.

---

## Authentication

The API uses **JWT Bearer tokens**. On first startup four test users are automatically created:

| Username | Password  | Role   |
|----------|-----------|--------|
| system   | system123 | SYSTEM |
| admin    | admin123  | ADMIN  |
| user     | user123   | USER   |
| viewer   | viewer123 | VIEWER |

**Login:**

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Use the returned token on all subsequent requests:**

```http
Authorization: Bearer <accessToken>
```

> A Postman collection is included at `helpdesk/Helpdesk_JWT_Postman_Collection.json`.

---

## Role-Based Access Control

| Resource                              | SYSTEM | ADMIN | USER | VIEWER |
|---------------------------------------|:------:|:-----:|:----:|:------:|
| Auth (`/api/auth/**`)                 | ✅ Public |||| 
| Companies, Departments, Projects      | ✅     | ✅    | ❌   | ❌     |
| Categories, Subcategories             | ✅     | ✅    | ❌   | ❌     |
| Statuses, Priorities, Service Types   | ✅     | ✅    | ❌   | ❌     |
| Escalation Matrices                   | ✅     | ✅    | ❌   | ❌     |
| Roles, Menus, Users                   | ✅     | ✅    | ❌   | ❌     |
| Tickets                               | ✅     | ✅    | ✅   | ❌     |

---

## API Overview

| Method                    | Endpoint                        | Description                         |
|---------------------------|---------------------------------|-------------------------------------|
| `POST`                    | `/api/auth/login`               | Authenticate and receive a JWT      |
| `GET/POST/PUT/DELETE`     | `/api/tickets/**`               | Ticket CRUD                         |
| `GET/POST/PUT/DELETE`     | `/api/companies/**`             | Company management                  |
| `GET/POST/PUT/DELETE`     | `/api/departments/**`           | Department management               |
| `GET/POST/PUT/DELETE`     | `/api/projects/**`              | Project management                  |
| `GET/POST/PUT/DELETE`     | `/api/categories/**`            | Category management                 |
| `GET/POST/PUT/DELETE`     | `/api/subcategories/**`         | Subcategory management              |
| `GET/POST/PUT/DELETE`     | `/api/priorities/**`            | Priority management                 |
| `GET/POST/PUT/DELETE`     | `/api/statuses/**`              | Status management                   |
| `GET/POST/PUT/DELETE`     | `/api/service-types/**`         | Service type management             |
| `GET/POST/PUT/DELETE`     | `/api/escalation-matrices/**`   | Escalation rule management          |
| `GET/POST/PUT/DELETE`     | `/api/users/**`                 | User management                     |

Full request/response schemas are documented in [`helpdesk/API_DOCUMENTATION.md`](helpdesk/API_DOCUMENTATION.md).

---

## Environment Configuration

### Backend — `application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/helpdesk_db
spring.datasource.username=helpdeskdb
spring.datasource.password=helpdesk123

# JWT
app.jwt.secret=<at-least-32-character-random-string>
app.jwt.access-ttl-seconds=3600

# Cloudinary (image uploads)
cloudinary.cloud-name=<your-cloud-name>
cloudinary.api-key=<your-api-key>
cloudinary.api-secret=<your-api-secret>
```

> ⚠️ **Never commit real secrets to version control.** Use environment variables or a secrets manager in production.

### Frontend — `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## Documentation

Additional docs live inside the `helpdesk/` backend directory:

| File | Description |
|------|-------------|
| [`API_DOCUMENTATION.md`](helpdesk/API_DOCUMENTATION.md) | Full REST API reference with request/response examples |
| [`JWT_AUTHENTICATION_GUIDE.md`](helpdesk/JWT_AUTHENTICATION_GUIDE.md) | Detailed JWT architecture and flow |
| [`JWT_QUICK_REFERENCE.md`](helpdesk/JWT_QUICK_REFERENCE.md) | 5-minute JWT quick-start |
| [`IMPLEMENTATION_SUMMARY.md`](helpdesk/IMPLEMENTATION_SUMMARY.md) | Summary of JWT implementation decisions |
| [`Helpdesk_JWT_Postman_Collection.json`](helpdesk/Helpdesk_JWT_Postman_Collection.json) | Ready-to-import Postman collection |
