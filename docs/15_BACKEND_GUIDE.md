# 15_BACKEND_GUIDE.md

# Backend Design Documentation

## Employee Performance Evaluation System

Version 2.0

---

# 1. Overview

Backend merupakan pusat logika bisnis (Business Logic Layer) pada Employee Performance Evaluation System.

Backend bertugas menghubungkan Frontend, Database, Cryptography Module, dan Smart Contract sehingga seluruh proses bisnis berjalan secara aman, modular, dan konsisten.

Backend dibangun menggunakan:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- ethers.js

---

# 2. Design Principles

Backend mengikuti prinsip:

- Clean Architecture
- SOLID Principle
- Separation of Concerns
- Repository Pattern
- Service Layer Pattern
- Dependency Injection (Future)
- Security by Design

---

# 3. Clean Architecture

```
                 Frontend

                     │

              HTTPS REST API

                     │

                 Express Router

                     │

          Authentication Middleware

                     │

           Authorization Middleware

                     │

                Request Validation

                     │

                 Controller Layer

                     │

                  Service Layer

       ┌─────────────┼─────────────┐

       ▼             ▼             ▼

Encryption      Blockchain      Repository

 Service          Service         Layer

       │             │             │

       └─────────────┼─────────────┘

                     ▼

                Prisma ORM

                     │

               PostgreSQL
```

---

# 4. Backend Folder Structure

```
backend/

src/

controllers/

auth.controller.ts

employee.controller.ts

evaluation.controller.ts

promotion.controller.ts

dashboard.controller.ts

services/

auth.service.ts

employee.service.ts

evaluation.service.ts

promotion.service.ts

dashboard.service.ts

repositories/

employee.repository.ts

evaluation.repository.ts

promotion.repository.ts

crypto/

aes.service.ts

hash.service.ts

key.service.ts

blockchain/

contract.service.ts

contract.ts

abi/

middlewares/

auth.middleware.ts

role.middleware.ts

validation.middleware.ts

error.middleware.ts

logger.middleware.ts

routes/

auth.routes.ts

employee.routes.ts

evaluation.routes.ts

promotion.routes.ts

dashboard.routes.ts

validation/

employee.schema.ts

evaluation.schema.ts

promotion.schema.ts

database/

prisma/

schema.prisma

prisma.ts

config/

jwt.ts

aes.ts

blockchain.ts

utils/

response.ts

logger.ts

types/

tests/

server.ts
```

---

# 5. Layer Responsibilities

## Controller Layer

Tanggung jawab:

- Menerima HTTP Request.
- Memanggil Service.
- Mengembalikan HTTP Response.

Controller tidak memiliki business logic.

---

## Service Layer

Service merupakan inti aplikasi.

Berisi:

- Business Rules
- Workflow
- Encryption
- Hash Generation
- Blockchain Integration

---

## Repository Layer

Repository hanya melakukan akses database.

Contoh:

- Create
- Update
- Delete
- Find

Repository tidak memiliki business logic.

---

## Crypto Layer

Berisi:

AES Encryption

AES Decryption

SHA-256 Generator

Hash Comparison

---

## Blockchain Layer

Berisi komunikasi ke Smart Contract.

Menggunakan:

- ethers.js
- ABI
- Contract Address

---

# 6. Request Flow

```
Client

↓

Router

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

Database
```

Jika membutuhkan blockchain.

```
Service

↓

Hash Service

↓

Blockchain Service

↓

Smart Contract
```

---

# 7. Authentication

Authentication menggunakan:

- Email
- Password
- JWT

Workflow

```
Login

↓

Verify Password

↓

Generate JWT

↓

Return Access Token
```

---

# 8. Authorization

Role:

- Employee
- Manager
- HR
- Director

Authorization dilakukan pada:

Backend

↓

Role Middleware

dan

Smart Contract

↓

Role Modifier

---

# 9. Employee Module

Service:

EmployeeService

Function:

- createEmployee()
- updateEmployee()
- deleteEmployee()
- getEmployee()
- listEmployee()

---

# 10. Evaluation Module

EvaluationService bertanggung jawab terhadap:

- Create Evaluation
- Review Evaluation
- Approve Evaluation
- Verify Evaluation

Workflow

```
Controller

↓

Evaluation Service

↓

AES Encrypt

↓

Repository

↓

Database

↓

SHA-256

↓

Blockchain Service

↓

Smart Contract
```

---

# 11. Promotion Module

PromotionService

Function

- recommendPromotion()
- approvePromotion()
- rejectPromotion()
- getPromotionHistory()

---

# 12. Cryptography Module

AES Service

Function

- encrypt()
- decrypt()

Hash Service

Function

- generateSHA256()
- compareHash()

---

# 13. Blockchain Module

Contract Service

Function

- submitEvaluation()
- reviewEvaluation()
- approveEvaluation()
- recommendPromotion()
- approvePromotion()
- verifyDocument()

---

# 14. Database Access

Menggunakan Prisma ORM.

Entity:

- User
- Role
- Employee
- Department
- Position
- Evaluation
- EvaluationDetail
- PromotionRequest
- PromotionHistory
- BlockchainTransaction
- AuditLog

---

# 15. Validation

Menggunakan:

Zod

Contoh schema:

- Login
- Employee
- Evaluation
- Promotion

Validation dilakukan sebelum Controller dijalankan.

---

# 16. Error Handling

Format response:

```json
{
  "success": false,
  "message": "Evaluation not found",
  "data": null
}
```

Success:

```json
{
  "success": true,
  "message": "Evaluation submitted",
  "data": {}
}
```

---

# 17. Logging

Menggunakan:

- Morgan
- Winston

Log yang dicatat:

- Login
- Logout
- CRUD
- Blockchain Transaction
- Error
- Audit

---

# 18. Environment Variables

Backend

```env
PORT=

DATABASE_URL=

JWT_SECRET=

AES_SECRET_KEY=

RPC_URL=

SMART_CONTRACT_ADDRESS=
```

Catatan:

Backend **tidak menyimpan private key pengguna**. Seluruh transaksi blockchain ditandatangani menggunakan MetaMask melalui frontend.

---

# 19. Security

Backend bertanggung jawab terhadap:

✔ JWT Authentication

✔ RBAC Authorization

✔ AES-256 Encryption

✔ SHA-256 Hashing

✔ Database Validation

✔ Smart Contract Integration

Backend tidak menyimpan:

- Password plaintext
- AES Key di database
- Private Key pengguna

---

# 20. Blockchain Synchronization

```
Evaluation Saved

↓

Database

↓

Pending Blockchain Sync

↓

Blockchain Service

↓

Smart Contract

↓

Success

↓

Update Sync Status
```

Jika transaksi gagal:

```
Pending Blockchain Sync

↓

Retry Queue

↓

Retry Transaction

↓

Success
```

---

# 21. API Design

REST API digunakan untuk komunikasi antara Frontend dan Backend.

Endpoint utama:

- /auth
- /employees
- /evaluations
- /promotions
- /dashboard
- /blockchain

---

# 22. Dependencies

Core

- express
- typescript
- prisma
- @prisma/client

Authentication

- jsonwebtoken
- bcrypt

Cryptography

- crypto

Blockchain

- ethers

Validation

- zod

Security

- helmet
- cors

Logging

- morgan
- winston

Configuration

- dotenv

---

# 23. Backend Workflow

```
User

↓

Frontend

↓

REST API

↓

Router

↓

Middleware

↓

Controller

↓

Business Service

├── Encryption Service

├── Hash Service

├── Blockchain Service

└── Repository

↓

Prisma ORM

↓

PostgreSQL

↓

Response
```

---

# 24. Responsibilities Summary

Backend bertanggung jawab terhadap:

- Authentication
- Authorization
- Business Logic
- Encryption
- Hashing
- Database
- Smart Contract Communication
- Error Handling
- Logging

Backend **tidak** bertanggung jawab terhadap:

- UI
- Wallet Interface
- Blockchain Consensus
- Private Key Management

---

# 25. Summary

Backend menggunakan Clean Architecture dengan pemisahan yang jelas antara Controller, Service, Repository, Cryptography Service, dan Blockchain Service.

Pendekatan ini membuat sistem lebih mudah diuji, dipelihara, dan dikembangkan. Integrasi PostgreSQL sebagai source of truth serta Smart Contract sebagai trusted audit layer menghasilkan arsitektur hybrid yang efisien, aman, dan sesuai untuk implementasi pada sistem penilaian kinerja karyawan berbasis Web3.