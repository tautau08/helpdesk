# Helpdesk API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8080`  
**Authentication:** JWT Bearer Token (except for `/api/auth/login`)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users Management](#users-management)
3. [Tickets Management](#tickets-management)
4. [Companies Management](#companies-management)
5. [Departments Management](#departments-management)
6. [Projects Management](#projects-management)
7. [Categories Management](#categories-management)
8. [Subcategories Management](#subcategories-management)
9. [Status Management](#status-management)
10. [Priority Management](#priority-management)
11. [Service Types Management](#service-types-management)
12. [Escalation Matrix Management](#escalation-matrix-management)
13. [Entity Relationships](#entity-relationships)
14. [Common Response Formats](#common-response-formats)
15. [Error Handling](#error-handling)

---

## Authentication

### Login

**Endpoint:** `POST /api/auth/login`  
**Authentication Required:** No

#### Request Body

```json
{
  "username": "string",
  "password": "string"
}
```

#### Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "admin",
  "roleName": "Administrator"
}
```

#### Usage Notes
- The `token` should be included in all subsequent requests as a Bearer token in the Authorization header
- Token expires after 3600 seconds (1 hour)
- Header format: `Authorization: Bearer {token}`

---

## Users Management

### List All Users

**Endpoint:** `GET /api/users`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description                    |
|-----------|---------|----------|--------------------------------|
| name      | String  | No       | Filter by user name (partial)  |
| isActive  | Boolean | No       | Filter by active status        |
| page      | Integer | No       | Page number (default: 0)       |
| size      | Integer | No       | Page size (default: 20)        |
| sort      | String  | No       | Sort field and direction       |

#### Example Request

```
GET /api/users?name=john&isActive=true&page=0&size=10&sort=name,asc
```

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "companyId": 1,
      "companyName": "Acme Corp",
      "projectId": 2,
      "projectName": "Project Alpha",
      "departmentId": 3,
      "departmentName": "IT Support",
      "roleId": 2,
      "roleName": "Support Agent",
      "createdUserId": 1,
      "createdTime": "2024-01-15 10:30:00",
      "updatedByUserId": 1,
      "updatedTime": "2024-01-20 14:45:00",
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 50,
  "last": false,
  "first": true,
  "size": 10,
  "number": 0,
  "numberOfElements": 10,
  "empty": false
}
```

### Get User by ID

**Endpoint:** `GET /api/users/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "companyId": 1,
  "companyName": "Acme Corp",
  "projectId": 2,
  "projectName": "Project Alpha",
  "departmentId": 3,
  "departmentName": "IT Support",
  "roleId": 2,
  "roleName": "Support Agent",
  "createdUserId": 1,
  "createdTime": "2024-01-15 10:30:00",
  "updatedByUserId": 1,
  "updatedTime": "2024-01-20 14:45:00",
  "sortOrder": 0,
  "isActive": true
}
```

#### Response (404 Not Found)

User not found

### Get User by Username

**Endpoint:** `GET /api/users/username/{username}`  
**Authentication Required:** Yes

#### Example Request

```
GET /api/users/username/johndoe
```

#### Response

Same as Get User by ID

### Get Users by Company

**Endpoint:** `GET /api/users/company/{companyId}`  
**Authentication Required:** Yes

#### Query Parameters

Supports pagination parameters (page, size, sort)

#### Response

Paginated list of users (same format as List All Users)

### Get Users by Project

**Endpoint:** `GET /api/users/project/{projectId}`  
**Authentication Required:** Yes

#### Response

Paginated list of users

### Get Users by Department

**Endpoint:** `GET /api/users/department/{departmentId}`  
**Authentication Required:** Yes

#### Response

Paginated list of users

### Get Users by Role

**Endpoint:** `GET /api/users/role/{roleId}`  
**Authentication Required:** Yes

#### Response

Paginated list of users

### Create User

**Endpoint:** `POST /api/users`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "password": "securePassword123",
  "email": "john.doe@example.com",
  "companyId": 1,
  "projectId": 2,
  "departmentId": 3,
  "roleId": 2,
  "sortOrder": 0,
  "isActive": true
}
```

#### Field Validations

| Field        | Type    | Required | Constraints                                |
|--------------|---------|----------|--------------------------------------------|
| name         | String  | Yes      | Max 150 characters                         |
| username     | String  | Yes      | 3-100 characters, must be unique           |
| password     | String  | Yes      | Min 6 characters (for create)              |
| email        | String  | No       | Valid email format, max 150 characters     |
| companyId    | Long    | Yes      | Must reference existing company            |
| projectId    | Long    | No       | Must reference existing project if provided|
| departmentId | Long    | Yes      | Must reference existing department         |
| roleId       | Long    | Yes      | Must reference existing role               |
| sortOrder    | Integer | No       | Default: 0                                 |
| isActive     | Boolean | No       | Default: true                              |

#### Response (200 OK)

Returns created user object

### Update User

**Endpoint:** `PUT /api/users/{id}`  
**Authentication Required:** Yes

#### Request Body

Same as Create User, but password is optional for updates

#### Response (200 OK)

Returns updated user object

### Activate User

**Endpoint:** `PATCH /api/users/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated user with `isActive: true`

### Deactivate User

**Endpoint:** `PATCH /api/users/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated user with `isActive: false`

### Delete User

**Endpoint:** `DELETE /api/users/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

User deleted successfully

---

## Tickets Management

### List All Tickets

**Endpoint:** `GET /api/tickets`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter        | Type    | Required | Description                    |
|------------------|---------|----------|--------------------------------|
| name             | String  | No       | Filter by ticket name          |
| companyId        | Long    | No       | Filter by company              |
| categoryId       | Long    | No       | Filter by category             |
| subcategoryId    | Long    | No       | Filter by subcategory          |
| currentStatusId  | Long    | No       | Filter by current status       |
| priorityId       | Long    | No       | Filter by priority             |
| serviceTypeId    | Long    | No       | Filter by service type         |
| page             | Integer | No       | Page number (default: 0)       |
| size             | Integer | No       | Page size (default: 20)        |

#### Example Request

```
GET /api/tickets?companyId=1&currentStatusId=2&page=0&size=10
```

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 101,
      "name": "Cannot access email",
      "description": "User reports unable to access company email since this morning",
      "companyId": 1,
      "companyName": "Acme Corp",
      "categoryId": 5,
      "categoryName": "Email Issues",
      "subcategoryId": 12,
      "subcategoryName": "Access Problem",
      "submittedStatusId": 1,
      "submittedStatusName": "New",
      "currentStatusId": 2,
      "currentStatusName": "In Progress",
      "priorityId": 2,
      "priorityName": "High",
      "serviceTypeId": 1,
      "serviceTypeName": "Incident",
      "createdUserId": 5,
      "createdTime": "2024-01-20 09:15:00",
      "updatedByUserId": 3,
      "updatedTime": "2024-01-20 10:30:00",
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... },
  "totalPages": 10,
  "totalElements": 95,
  "last": false,
  "first": true
}
```

### Get Ticket by ID

**Endpoint:** `GET /api/tickets/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single ticket object

#### Response (404 Not Found)

Ticket not found with id: {id}

### Get Tickets by User

**Endpoint:** `GET /api/tickets/user/{userId}`  
**Authentication Required:** Yes

#### Query Parameters

Supports pagination parameters

#### Response

Paginated list of tickets created by the specified user

### Create Ticket

**Endpoint:** `POST /api/tickets`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "Cannot access email",
  "description": "User reports unable to access company email since this morning",
  "companyId": 1,
  "categoryId": 5,
  "subcategoryId": 12,
  "statusId": 1,
  "priorityId": 2,
  "serviceTypeId": 1,
  "sortOrder": 0,
  "isActive": true
}
```

#### Field Validations

| Field         | Type    | Required | Constraints                          |
|---------------|---------|----------|--------------------------------------|
| name          | String  | Yes      | Max 150 characters                   |
| description   | String  | No       | Detailed description of the issue    |
| companyId     | Long    | Yes      | Must reference existing company      |
| categoryId    | Long    | Yes      | Must reference existing category     |
| subcategoryId | Long    | Yes      | Must reference existing subcategory  |
| statusId      | Long    | Yes      | Used for both submitted and current  |
| priorityId    | Long    | Yes      | Must reference existing priority     |
| serviceTypeId | Long    | Yes      | Must reference existing service type |
| sortOrder     | Integer | No       | Default: 0                           |
| isActive      | Boolean | No       | Default: true                        |

#### Usage Notes
- `statusId` will be set as both `submittedStatus` (immutable) and `currentStatus` (can be updated) on creation
- The ticket is automatically associated with the authenticated user as the creator

#### Response (200 OK)

Returns created ticket object

### Update Ticket

**Endpoint:** `PUT /api/tickets/{id}`  
**Authentication Required:** Yes

#### Request Body

Same as Create Ticket

#### Response (200 OK)

Returns updated ticket object

### Activate Ticket

**Endpoint:** `PATCH /api/tickets/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns ticket with `isActive: true`

### Deactivate Ticket

**Endpoint:** `PATCH /api/tickets/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns ticket with `isActive: false`

### Delete Ticket

**Endpoint:** `DELETE /api/tickets/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Ticket deleted successfully

---

## Companies Management

### List All Companies

**Endpoint:** `GET /api/companies`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description              |
|-----------|---------|----------|--------------------------|
| name      | String  | No       | Filter by name (ignored) |
| page      | Integer | No       | Page number              |
| size      | Integer | No       | Page size                |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "Acme Corp",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... },
  "totalPages": 1,
  "totalElements": 5
}
```

### Get Company by ID

**Endpoint:** `GET /api/companies/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single company object

#### Response (404 Not Found)

Company not found

### Create Company

**Endpoint:** `POST /api/companies`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "Acme Corp",
  "sortOrder": 0,
  "isActive": true
}
```

#### Field Validations

| Field     | Type    | Required | Constraints        |
|-----------|---------|----------|--------------------|
| name      | String  | Yes      | Max 150 characters |
| sortOrder | Integer | No       | Default: 0         |
| isActive  | Boolean | No       | Default: true      |

#### Response (200 OK)

Returns created company object

### Update Company

**Endpoint:** `PUT /api/companies/{id}`  
**Authentication Required:** Yes

#### Request Body

Same as Create Company

#### Response (200 OK)

Returns updated company object

### Activate Company

**Endpoint:** `PATCH /api/companies/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns company with `isActive: true`

### Deactivate Company

**Endpoint:** `PATCH /api/companies/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns company with `isActive: false`

### Delete Company

**Endpoint:** `DELETE /api/companies/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Company deleted successfully

---

## Departments Management

### List All Departments

**Endpoint:** `GET /api/departments`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description                   |
|-----------|---------|----------|-------------------------------|
| name      | String  | No       | Filter by name (partial)      |
| isActive  | Boolean | No       | Filter by active status       |
| page      | Integer | No       | Page number                   |
| size      | Integer | No       | Page size                     |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "IT Support",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... },
  "totalPages": 1,
  "totalElements": 8
}
```

### Get Department by ID

**Endpoint:** `GET /api/departments/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single department object

#### Response (404 Not Found)

Department not found

### Create Department

**Endpoint:** `POST /api/departments`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "IT Support",
  "sortOrder": 0,
  "isActive": true
}
```

#### Response (200 OK)

Returns created department object

### Update Department

**Endpoint:** `PUT /api/departments/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated department object

### Activate Department

**Endpoint:** `PATCH /api/departments/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns department with `isActive: true`

### Deactivate Department

**Endpoint:** `PATCH /api/departments/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns department with `isActive: false`

### Delete Department

**Endpoint:** `DELETE /api/departments/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Department deleted successfully

---

## Projects Management

### List All Projects

**Endpoint:** `GET /api/projects`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description  |
|-----------|---------|----------|--------------|
| page      | Integer | No       | Page number  |
| size      | Integer | No       | Page size    |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "Project Alpha",
      "companyId": 1,
      "createdUserId": 1,
      "createdTime": "2024-01-05 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... },
  "totalPages": 2,
  "totalElements": 15
}
```

### Get Project by ID

**Endpoint:** `GET /api/projects/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single project object

#### Response (404 Not Found)

Project not found

### Create Project

**Endpoint:** `POST /api/projects`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "Project Alpha",
  "companyId": 1,
  "sortOrder": 0,
  "isActive": true
}
```

#### Field Validations

| Field     | Type    | Required | Constraints                     |
|-----------|---------|----------|---------------------------------|
| name      | String  | Yes      | Max 150 characters              |
| companyId | Long    | No       | Must reference existing company |
| sortOrder | Integer | No       | Default: 0                      |
| isActive  | Boolean | No       | Default: true                   |

#### Response (200 OK)

Returns created project object

### Update Project

**Endpoint:** `PUT /api/projects/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated project object

### Activate Project

**Endpoint:** `PATCH /api/projects/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns project with `isActive: true`

### Deactivate Project

**Endpoint:** `PATCH /api/projects/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns project with `isActive: false`

### Delete Project

**Endpoint:** `DELETE /api/projects/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Project deleted successfully

---

## Categories Management

### List All Categories

**Endpoint:** `GET /api/categories`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description                   |
|-----------|---------|----------|-------------------------------|
| projectId | Long    | No       | Filter by project             |
| name      | String  | No       | Filter by name (partial)      |
| page      | Integer | No       | Page number                   |
| size      | Integer | No       | Page size                     |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "Email Issues",
      "projectId": 1,
      "createdUserId": 1,
      "createdTime": "2024-01-05 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... },
  "totalPages": 3,
  "totalElements": 25
}
```

### Get Category by ID

**Endpoint:** `GET /api/categories/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single category object

#### Response (404 Not Found)

Category not found

### Create Category

**Endpoint:** `POST /api/categories`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "Email Issues",
  "projectId": 1,
  "sortOrder": 0,
  "isActive": true
}
```

#### Field Validations

| Field     | Type    | Required | Constraints                    |
|-----------|---------|----------|--------------------------------|
| name      | String  | Yes      | Max 150 characters             |
| projectId | Long    | Yes      | Must reference existing project|
| sortOrder | Integer | No       | Default: 0                     |
| isActive  | Boolean | No       | Default: true                  |

#### Response (200 OK)

Returns created category object

### Update Category

**Endpoint:** `PUT /api/categories/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated category object

### Activate Category

**Endpoint:** `PATCH /api/categories/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns category with `isActive: true`

### Deactivate Category

**Endpoint:** `PATCH /api/categories/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns category with `isActive: false`

### Delete Category

**Endpoint:** `DELETE /api/categories/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Category deleted successfully

---

## Subcategories Management

### List All Subcategories

**Endpoint:** `GET /api/subcategories`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter  | Type    | Required | Description                   |
|------------|---------|----------|-------------------------------|
| categoryId | Long    | No       | Filter by category            |
| name       | String  | No       | Filter by name (partial)      |
| page       | Integer | No       | Page number                   |
| size       | Integer | No       | Page size                     |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "Access Problem",
      "categoryId": 5,
      "responseTime": 30,
      "resolutionTime": 120,
      "isCustomerResponseRequired": true,
      "createdUserId": 1,
      "createdTime": "2024-01-05 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... },
  "totalPages": 5,
  "totalElements": 45
}
```

### Get Subcategory by ID

**Endpoint:** `GET /api/subcategories/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single subcategory object

#### Response (404 Not Found)

Subcategory not found

### Create Subcategory

**Endpoint:** `POST /api/subcategories`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "Access Problem",
  "categoryId": 5,
  "responseTime": 30,
  "resolutionTime": 120,
  "isCustomerResponseRequired": true,
  "sortOrder": 0,
  "isActive": true
}
```

#### Field Validations

| Field                        | Type    | Required | Constraints                      |
|------------------------------|---------|----------|----------------------------------|
| name                         | String  | Yes      | Max 150 characters               |
| categoryId                   | Long    | Yes      | Must reference existing category |
| responseTime                 | Integer | No       | Time in minutes                  |
| resolutionTime               | Integer | No       | Time in minutes                  |
| isCustomerResponseRequired   | Boolean | No       | Default: false                   |
| sortOrder                    | Integer | No       | Default: 0                       |
| isActive                     | Boolean | No       | Default: true                    |

#### Response (200 OK)

Returns created subcategory object

### Update Subcategory

**Endpoint:** `PUT /api/subcategories/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated subcategory object

### Activate Subcategory

**Endpoint:** `PATCH /api/subcategories/{id}/activate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns subcategory with `isActive: true`

### Deactivate Subcategory

**Endpoint:** `PATCH /api/subcategories/{id}/deactivate`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns subcategory with `isActive: false`

### Require Customer Response

**Endpoint:** `PATCH /api/subcategories/{id}/require-customer-response`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns subcategory with `isCustomerResponseRequired: true`

### No Customer Response Required

**Endpoint:** `PATCH /api/subcategories/{id}/no-customer-response`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns subcategory with `isCustomerResponseRequired: false`

### Delete Subcategory

**Endpoint:** `DELETE /api/subcategories/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Subcategory deleted successfully

---

## Status Management

### List All Statuses

**Endpoint:** `GET /api/statuses`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description                   |
|-----------|---------|----------|-------------------------------|
| name      | String  | No       | Filter by name (partial)      |
| page      | Integer | No       | Page number                   |
| size      | Integer | No       | Page size                     |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "New",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    },
    {
      "id": 2,
      "name": "In Progress",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 1,
      "isActive": true
    }
  ],
  "pageable": { ... }
}
```

### Get Status by ID

**Endpoint:** `GET /api/statuses/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single status object

### Create Status

**Endpoint:** `POST /api/statuses`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "In Progress",
  "sortOrder": 1,
  "isActive": true
}
```

#### Response (200 OK)

Returns created status object

### Update Status

**Endpoint:** `PUT /api/statuses/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated status object

### Activate Status

**Endpoint:** `PATCH /api/statuses/{id}/activate`  
**Authentication Required:** Yes

### Deactivate Status

**Endpoint:** `PATCH /api/statuses/{id}/deactivate`  
**Authentication Required:** Yes

### Delete Status

**Endpoint:** `DELETE /api/statuses/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

---

## Priority Management

### List All Priorities

**Endpoint:** `GET /api/priorities`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description                   |
|-----------|---------|----------|-------------------------------|
| name      | String  | No       | Filter by name (partial)      |
| page      | Integer | No       | Page number                   |
| size      | Integer | No       | Page size                     |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "Low",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    },
    {
      "id": 2,
      "name": "High",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 2,
      "isActive": true
    }
  ],
  "pageable": { ... }
}
```

### Get Priority by ID

**Endpoint:** `GET /api/priorities/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single priority object

### Create Priority

**Endpoint:** `POST /api/priorities`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "High",
  "sortOrder": 2,
  "isActive": true
}
```

#### Response (200 OK)

Returns created priority object

### Update Priority

**Endpoint:** `PUT /api/priorities/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated priority object

### Activate Priority

**Endpoint:** `PATCH /api/priorities/{id}/activate`  
**Authentication Required:** Yes

### Deactivate Priority

**Endpoint:** `PATCH /api/priorities/{id}/deactivate`  
**Authentication Required:** Yes

### Delete Priority

**Endpoint:** `DELETE /api/priorities/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

---

## Service Types Management

### List All Service Types

**Endpoint:** `GET /api/service-types`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description                   |
|-----------|---------|----------|-------------------------------|
| name      | String  | No       | Filter by name (partial)      |
| page      | Integer | No       | Page number                   |
| size      | Integer | No       | Page size                     |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "name": "Incident",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    },
    {
      "id": 2,
      "name": "Service Request",
      "createdUserId": 1,
      "createdTime": "2024-01-01 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 1,
      "isActive": true
    }
  ],
  "pageable": { ... }
}
```

### Get Service Type by ID

**Endpoint:** `GET /api/service-types/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single service type object

### Create Service Type

**Endpoint:** `POST /api/service-types`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "name": "Incident",
  "sortOrder": 0,
  "isActive": true
}
```

#### Response (200 OK)

Returns created service type object

### Update Service Type

**Endpoint:** `PUT /api/service-types/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated service type object

### Activate Service Type

**Endpoint:** `PATCH /api/service-types/{id}/activate`  
**Authentication Required:** Yes

### Deactivate Service Type

**Endpoint:** `PATCH /api/service-types/{id}/deactivate`  
**Authentication Required:** Yes

### Delete Service Type

**Endpoint:** `DELETE /api/service-types/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

---

## Escalation Matrix Management

### List All Escalation Matrices

**Endpoint:** `GET /api/escalation-matrices`  
**Authentication Required:** Yes

#### Query Parameters

| Parameter | Type    | Required | Description  |
|-----------|---------|----------|--------------|
| page      | Integer | No       | Page number  |
| size      | Integer | No       | Page size    |

#### Response (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "subcategoryId": 12,
      "type": "PRE",
      "from": 0,
      "to": 30,
      "email": "support-l1@example.com",
      "createdUserId": 1,
      "createdTime": "2024-01-05 10:00:00",
      "updatedByUserId": null,
      "updatedTime": null,
      "sortOrder": 0,
      "isActive": true
    }
  ],
  "pageable": { ... }
}
```

### Get Escalation Matrix by ID

**Endpoint:** `GET /api/escalation-matrices/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns single escalation matrix object

### Get Escalation Matrices by Subcategory and Type

**Endpoint:** `GET /api/escalation-matrices/subcategory/{subcategoryId}/type/{type}`  
**Authentication Required:** Yes

#### Path Parameters

| Parameter     | Type           | Required | Description                |
|---------------|----------------|----------|----------------------------|
| subcategoryId | Long           | Yes      | Subcategory ID             |
| type          | EscalationType | Yes      | Either "PRE" or "POST"     |

#### Example Request

```
GET /api/escalation-matrices/subcategory/12/type/PRE
```

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "subcategoryId": 12,
    "type": "PRE",
    "from": 0,
    "to": 30,
    "email": "support-l1@example.com",
    "createdUserId": 1,
    "createdTime": "2024-01-05 10:00:00",
    "updatedByUserId": null,
    "updatedTime": null,
    "sortOrder": 0,
    "isActive": true
  },
  {
    "id": 2,
    "subcategoryId": 12,
    "type": "PRE",
    "from": 30,
    "to": 60,
    "email": "support-l2@example.com",
    "createdUserId": 1,
    "createdTime": "2024-01-05 10:00:00",
    "updatedByUserId": null,
    "updatedTime": null,
    "sortOrder": 1,
    "isActive": true
  }
]
```

### Create Escalation Matrix

**Endpoint:** `POST /api/escalation-matrices`  
**Authentication Required:** Yes

#### Request Body

```json
{
  "subcategoryId": 12,
  "type": "PRE",
  "from": 0,
  "to": 30,
  "email": "support-l1@example.com"
}
```

#### Field Validations

| Field         | Type           | Required | Constraints                         |
|---------------|----------------|----------|-------------------------------------|
| subcategoryId | Long           | Yes      | Must reference existing subcategory |
| type          | EscalationType | Yes      | Either "PRE" or "POST"              |
| from          | Integer        | Yes      | Time range start (minutes)          |
| to            | Integer        | Yes      | Time range end (minutes)            |
| email         | String         | Yes      | Escalation notification email       |

#### Usage Notes
- **PRE**: Pre-escalation (before resolution time expires)
- **POST**: Post-escalation (after resolution time expires)
- Time ranges define when to send escalation emails

#### Response (200 OK)

Returns created escalation matrix object

### Update Escalation Matrix

**Endpoint:** `PUT /api/escalation-matrices/{id}`  
**Authentication Required:** Yes

#### Response (200 OK)

Returns updated escalation matrix object

### Delete Escalation Matrix

**Endpoint:** `DELETE /api/escalation-matrices/{id}`  
**Authentication Required:** Yes

#### Response (204 No Content)

Escalation matrix deleted successfully

---

## Entity Relationships

### Database Schema Overview

```
┌─────────────┐
│  companies  │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
  ┌─────────┐   ┌──────────┐
  │ projects│   │  users   │
  └────┬────┘   └────┬─────┘
       │             │
       │             ├──────────────┬──────────────┬
       │             │              │              │
       ▼             ▼              ▼              ▼
  ┌───────────┐  ┌────────┐  ┌─────────────┐  ┌──────┐
  │categories │  │ tickets│  │ departments │  │ roles│
  └─────┬─────┘  └────┬───┘  └─────────────┘  └───┬──┘
        │             │                            │
        ▼             │                            │
  ┌──────────────┐   │                            ▼
  │subcategories │◄──┘                       ┌────────┐
  └──────┬───────┘                           │ menus  │
         │                                   └────────┘
         ▼
  ┌────────────────────┐
  │escalation_matrices │
  └────────────────────┘

  Additional Entities:
  ┌────────┐  ┌──────────────┐  ┌──────────────┐
  │statuses│  │priority_list │  │service_types │
  └────────┘  └──────────────┘  └──────────────┘
```

### Relationship Details

#### User Relationships
- **User** belongs to one **Company** (required)
- **User** belongs to one **Department** (required)
- **User** belongs to one **Role** (required)
- **User** may belong to one **Project** (optional)

#### Ticket Relationships
- **Ticket** belongs to one **Company** (required)
- **Ticket** belongs to one **Category** (required)
- **Ticket** belongs to one **Subcategory** (required)
- **Ticket** has one **submittedStatus** (Status, immutable)
- **Ticket** has one **currentStatus** (Status, mutable)
- **Ticket** belongs to one **Priority** (required)
- **Ticket** belongs to one **ServiceType** (required)
- **Ticket** is created by a **User** (tracked via createdUserId)

#### Project-Category Hierarchy
- **Project** may belong to one **Company** (optional)
- **Category** belongs to one **Project** (required)
- **Subcategory** belongs to one **Category** (required)

#### Escalation Matrix
- **EscalationMatrix** belongs to one **Subcategory** (required)
- Multiple escalation rules can exist per subcategory
- Differentiated by type (PRE or POST) and time ranges

#### Role-Menu Permissions
- **Role** can have many **Menus** (many-to-many)
- **Menu** can belong to many **Roles** (many-to-many)

### Base Auditable Fields

All entities (except Ticket for description) extend `BaseAuditable` which includes:

| Field            | Type    | Description                                    |
|------------------|---------|------------------------------------------------|
| id               | Long    | Primary key (auto-generated)                   |
| name             | String  | Entity name (max 150 chars, required)          |
| createdUserId    | Long    | ID of user who created the record              |
| createdTime      | Instant | Timestamp when record was created (UTC)        |
| updatedByUserId  | Long    | ID of user who last updated the record         |
| updatedTime      | Instant | Timestamp when record was last updated (UTC)   |
| sortOrder        | Integer | Display order (default: 0)                     |
| isActive         | Boolean | Active status flag (default: true)             |

---

## Common Response Formats

### Paginated Response

All list endpoints return paginated results:

```json
{
  "content": [ /* Array of entity objects */ ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 95,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "numberOfElements": 20,
  "empty": false
}
```

### Pagination Parameters

| Parameter | Type    | Default | Description                                    |
|-----------|---------|---------|------------------------------------------------|
| page      | Integer | 0       | Page number (0-based)                          |
| size      | Integer | 20      | Number of items per page                       |
| sort      | String  | -       | Sort field and direction, e.g., "name,asc"     |

#### Sort Examples

```
?sort=name,asc                  # Sort by name ascending
?sort=createdTime,desc          # Sort by creation time descending
?sort=name,asc&sort=id,desc     # Multi-field sort
```

### Date/Time Format

All timestamps use ISO 8601 format in UTC:

**Request/Response Format:** `yyyy-MM-dd HH:mm:ss`

**Example:** `2024-01-20 14:45:00`

---

## Error Handling

### HTTP Status Codes

| Code | Description                                      |
|------|--------------------------------------------------|
| 200  | OK - Request succeeded                           |
| 201  | Created - Resource created successfully          |
| 204  | No Content - Success with no response body       |
| 400  | Bad Request - Invalid request data               |
| 401  | Unauthorized - Missing or invalid authentication |
| 403  | Forbidden - Insufficient permissions             |
| 404  | Not Found - Resource not found                   |
| 500  | Internal Server Error - Server error occurred    |

### Error Response Format

```json
{
  "timestamp": "2024-01-20T14:45:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='createUserDto'. Error count: 2",
  "errors": [
    {
      "field": "username",
      "rejectedValue": "ab",
      "message": "Username must be between 3 and 100 characters"
    },
    {
      "field": "password",
      "rejectedValue": "123",
      "message": "Password must be at least 6 characters"
    }
  ],
  "path": "/api/users"
}
```

### Validation Error Messages

Common validation errors:

- **Required Field Missing:** `{field} is required`
- **Invalid Format:** `{field} should be valid`
- **Length Constraint:** `{field} must be between {min} and {max} characters`
- **Foreign Key Constraint:** `{entity} not found with id: {id}`
- **Unique Constraint:** `{field} already exists`

---

## Authentication Flow

### Step-by-Step Authentication

1. **Login Request**
   ```bash
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Login Response**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNzA1NzU4MDAwLCJleHAiOjE3MDU3NjE2MDB9.abc123",
     "userId": 1,
     "username": "admin",
     "roleName": "Administrator"
   }
   ```

3. **Using Token in Subsequent Requests**
   ```bash
   GET /api/users
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Token Information

- **Algorithm:** HS256 (HMAC with SHA-256)
- **Expiration:** 3600 seconds (1 hour)
- **Claims:**
  - `sub`: User ID
  - `username`: Username
  - `role`: Role name
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp

### Frontend Implementation Tips

1. **Store Token Securely**
   - Use `localStorage` or `sessionStorage`
   - Consider using `httpOnly` cookies for better security

2. **Automatic Token Refresh**
   - Implement token refresh before expiration
   - Handle 401 errors by redirecting to login

3. **Axios Interceptor Example**
   ```javascript
   axios.interceptors.request.use(
     config => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     error => Promise.reject(error)
   );
   ```

---

## Frontend Integration Guidelines

### Recommended Libraries

- **HTTP Client:** Axios or Fetch API
- **State Management:** Redux, Zustand, or Context API
- **Form Validation:** Formik + Yup, React Hook Form
- **Date Handling:** date-fns or Day.js
- **UI Components:** Material-UI, Ant Design, or Chakra UI

### Example API Service (JavaScript/TypeScript)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  login: (username, password) => 
    apiClient.post('/auth/login', { username, password }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// User Service
export const userService = {
  getAll: (params) => 
    apiClient.get('/users', { params }),
  
  getById: (id) => 
    apiClient.get(`/users/${id}`),
  
  create: (data) => 
    apiClient.post('/users', data),
  
  update: (id, data) => 
    apiClient.put(`/users/${id}`, data),
  
  activate: (id) => 
    apiClient.patch(`/users/${id}/activate`),
  
  deactivate: (id) => 
    apiClient.patch(`/users/${id}/deactivate`),
  
  delete: (id) => 
    apiClient.delete(`/users/${id}`),
};

// Ticket Service
export const ticketService = {
  getAll: (params) => 
    apiClient.get('/tickets', { params }),
  
  getById: (id) => 
    apiClient.get(`/tickets/${id}`),
  
  create: (data) => 
    apiClient.post('/tickets', data),
  
  update: (id, data) => 
    apiClient.put(`/tickets/${id}`, data),
  
  getUserTickets: (userId, params) => 
    apiClient.get(`/tickets/user/${userId}`, { params }),
};

// Similar services for other entities...
```

### Example React Component

```jsx
import React, { useState, useEffect } from 'react';
import { ticketService } from './services/api';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadTickets();
  }, [page]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAll({ 
        page, 
        size: 10,
        sort: 'createdTime,desc'
      });
      setTickets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.name}</td>
              <td>{ticket.currentStatusName}</td>
              <td>{ticket.priorityName}</td>
              <td>{ticket.createdTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## Testing with Postman

A Postman collection is available: `Helpdesk_JWT_Postman_Collection.json`

### Quick Start

1. Import the collection into Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (will be set automatically after login)
3. Run the login request first
4. Token will be automatically applied to subsequent requests

---

## Appendix

### Common Use Cases

#### Creating a New Ticket

1. Get list of companies: `GET /api/companies`
2. Get categories for a project: `GET /api/categories?projectId={id}`
3. Get subcategories for a category: `GET /api/subcategories?categoryId={id}`
4. Get priorities: `GET /api/priorities`
5. Get service types: `GET /api/service-types`
6. Get statuses: `GET /api/statuses`
7. Create ticket: `POST /api/tickets` with collected IDs

#### User Registration Flow

1. Get companies: `GET /api/companies`
2. Get departments: `GET /api/departments`
3. Get roles: `GET /api/roles` (if endpoint exists)
4. Get projects (optional): `GET /api/projects`
5. Create user: `POST /api/users`

#### Filtering Tickets by Multiple Criteria

```
GET /api/tickets?companyId=1&priorityId=2&currentStatusId=3&page=0&size=20
```

### Field Dependencies

- **Category** requires **Project**
- **Subcategory** requires **Category**
- **User** requires **Company**, **Department**, and **Role**
- **Ticket** requires **Company**, **Category**, **Subcategory**, **Status**, **Priority**, and **ServiceType**
- **EscalationMatrix** requires **Subcategory**

### Enumerations

#### EscalationType

- `PRE` - Pre-escalation (before resolution time)
- `POST` - Post-escalation (after resolution time)

---

## Support and Contact

For API issues or questions:
- Review the error response for detailed validation messages
- Check the relationships section for foreign key dependencies
- Ensure JWT token is valid and not expired
- Verify all required fields are provided in create/update requests

---

**Last Updated:** November 19, 2025  
**Document Version:** 1.0
