# 16_API_SPECIFICATION.md

# REST API Specification

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini mendefinisikan seluruh REST API yang digunakan pada Employee Performance Evaluation System.

Seluruh komunikasi antara Frontend dan Backend dilakukan menggunakan HTTPS dengan format JSON.

Base URL

```
https://api.company.com/api/v1
```

Development

```
http://localhost:5000/api/v1
```

---

# 2. API Standards

Request

```
application/json
```

Response

```
application/json
```

Date Format

```
ISO 8601
```

Authentication

```
JWT Bearer Token
```

---

# 3. Standard Response

Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": []
}
```

---

# 4. Authentication API

## Login

POST

```
/auth/login
```

Request

```json
{
    "email":"manager@company.com",
    "password":"password123"
}
```

Response

```json
{
    "success":true,
    "data":{
        "accessToken":"JWT_TOKEN",
        "user":{
            "id":"",
            "name":"",
            "role":"Manager"
        }
    }
}
```

---

## Logout

POST

```
/auth/logout
```

---

## Get Profile

GET

```
/auth/profile
```

---

# 5. Employee API

## Get Employees

GET

```
/employees
```

Query

```
?page=1

&limit=10

&search=

&department=
```

---

## Get Employee Detail

GET

```
/employees/{id}
```

---

## Create Employee

POST

```
/employees
```

Request

```json
{
    "employeeCode":"EMP001",
    "fullName":"John Doe",
    "departmentId":"",
    "positionId":"",
    "phone":"0812xxxx",
    "address":"Jakarta"
}
```

Backend

↓

AES Encrypt

↓

Save Database

---

## Update Employee

PUT

```
/employees/{id}
```

---

## Delete Employee

DELETE

```
/employees/{id}
```

---

# 6. Department API

GET

```
/departments
```

POST

```
/departments
```

PUT

```
/departments/{id}
```

DELETE

```
/departments/{id}
```

---

# 7. Position API

GET

```
/positions
```

POST

```
/positions
```

PUT

```
/positions/{id}
```

DELETE

```
/positions/{id}
```

---

# 8. Evaluation API

## Create Evaluation

POST

```
/evaluations
```

Request

```json
{
    "employeeId":"",
    "periodId":"",
    "scores":[
        {
            "indicator":"Leadership",
            "score":90
        },
        {
            "indicator":"Teamwork",
            "score":88
        }
    ],
    "comment":"Excellent Performance"
}
```

Workflow

```
Validation

↓

AES Encrypt Comment

↓

Save Database

↓

SHA-256

↓

Blockchain
```

---

## Get Evaluations

GET

```
/evaluations
```

---

## Get Evaluation Detail

GET

```
/evaluations/{id}
```

---

## Review Evaluation

PUT

```
/evaluations/{id}/review
```

---

## Approve Evaluation

PUT

```
/evaluations/{id}/approve
```

---

## Verify Evaluation

POST

```
/evaluations/{id}/verify
```

Response

```json
{
    "valid":true
}
```

---

# 9. Promotion API

## Create Promotion Request

POST

```
/promotions
```

---

## Approve Promotion

PUT

```
/promotions/{id}/approve
```

---

## Reject Promotion

PUT

```
/promotions/{id}/reject
```

---

## Promotion History

GET

```
/promotions/history
```

---

# 10. Blockchain API

## Get Transactions

GET

```
/blockchain/transactions
```

---

## Get Transaction Detail

GET

```
/blockchain/transactions/{txHash}
```

---

## Retry Blockchain Sync

POST

```
/blockchain/retry
```

---

## Verify Hash

POST

```
/blockchain/verify
```

Request

```json
{
    "evaluationId":"..."
}
```

Response

```json
{
    "valid":true,
    "transactionHash":"..."
}
```

---

# 11. Dashboard API

GET

```
/dashboard
```

Response

```json
{
    "totalEmployee":120,
    "totalEvaluation":100,
    "pendingPromotion":10,
    "latestTransaction":[]
}
```

---

# 12. Audit Log API

GET

```
/audit-logs
```

Query

```
?page=

&limit=

&user=

&activity=
```

---

# 13. HTTP Status Code

| Code | Description |
|------|-------------|
|200|Success|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|500|Internal Server Error|

---

# 14. Authentication Flow

```
Client

↓

POST /login

↓

JWT

↓

Authorization Header

↓

Protected API
```

Header

```
Authorization:

Bearer JWT_TOKEN
```

---

# 15. Validation Rules

Employee

- Name Required
- Department Required
- Position Required

Evaluation

- Score 0-100
- Comment Max 1000 Characters

Promotion

- Must Have Approved Evaluation

---

# 16. Rate Limiting

Login

```
5 Request / Minute
```

General API

```
100 Request / Minute
```

---

# 17. API Security

Menggunakan:

- HTTPS
- JWT
- RBAC
- Helmet
- CORS
- Input Validation
- SQL Injection Protection
- AES Encryption

---

# 18. API Versioning

Versi pertama

```
/api/v1/
```

Contoh

```
/api/v1/employees
```

---

# 19. Endpoint Summary

| Module | Endpoint |
|----------|----------|
|Auth|/auth|
|Employee|/employees|
|Department|/departments|
|Position|/positions|
|Evaluation|/evaluations|
|Promotion|/promotions|
|Dashboard|/dashboard|
|Blockchain|/blockchain|
|Audit Log|/audit-logs|

---

# 20. Summary

REST API dirancang mengikuti prinsip RESTful Architecture dengan pemisahan modul berdasarkan domain bisnis.

Seluruh endpoint diamankan menggunakan JWT Authentication dan Role-Based Access Control (RBAC). Data sensitif dienkripsi menggunakan AES-256 sebelum disimpan ke database, sedangkan integritas dokumen dijamin menggunakan SHA-256 yang dicatat pada Smart Contract Ethereum.

Dokumentasi ini menjadi acuan implementasi Backend (Express.js), Frontend (Next.js), serta integrasi dengan Smart Contract menggunakan ethers.js.