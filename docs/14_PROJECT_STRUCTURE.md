# Project Structure

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan struktur direktori, standar penamaan, organisasi kode, serta pembagian tanggung jawab setiap modul pada Employee Performance Evaluation System.

Project menggunakan arsitektur Hybrid yang terdiri dari:

- Frontend
- Backend
- Database
- Smart Contract

Setiap komponen dikembangkan secara independen agar mudah dipelihara dan dikembangkan.

---

# 2. Project Directory

employee-performance-system/

```text
employee-performance-system/
│
├── frontend/
│
├── backend/
│
├── smart-contract/
│
├── docs/
│
├── database/
│
├── scripts/
│
├── assets/
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# 3. Frontend Structure

Framework

Next.js

```text
frontend/

app/

(auth)/

dashboard/

employees/

evaluations/

promotions/

blockchain/

profile/

settings/

components/

ui/

layout/

forms/

tables/

charts/

services/

hooks/

lib/

utils/

types/

public/

middleware.ts
```

---

# 4. Backend Structure

Framework

Node.js + Express

```text
backend/

src/

controllers/

services/

routes/

middlewares/

repositories/

models/

config/

utils/

encryption/

blockchain/

validation/

database/

uploads/

tests/

server.js
```

---

# 5. Smart Contract Structure

```text
smart-contract/

contracts/

ASNMeritSystem.sol

abis/

deploy/

scripts/

README.md
```

Apabila hanya menggunakan Remix.

Folder:

deploy/

berisi:

- ABI
- Contract Address
- Deployment Information

---

# 6. Database Structure

```text
database/

schema/

migration/

seed/

backup/

README.md
```

---

# 7. Documentation Structure

```text
docs/

00_PROJECT_CONTEXT.md

01_PROJECT_OVERVIEW.md

02_SYSTEM_REQUIREMENTS.md

03_SYSTEM_ARCHITECTURE.md

04_USE_CASE.md

05_BUSINESS_PROCESS.md

06_SYSTEM_FLOW.md

07_DATABASE_DESIGN.md

08_SMART_CONTRACT_DESIGN.md

09_CRYPTOGRAPHY.md

10_FRONTEND_GUIDE.md

11_DEPLOYMENT_GUIDE.md

12_TESTING_GUIDE.md

13_SECURITY_ANALYSIS.md

14_PROJECT_STRUCTURE.md

README.md
```

---

# 8. Environment Variables

Frontend

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_CONTRACT_ADDRESS=

NEXT_PUBLIC_CHAIN_ID=
```

Backend

```env
PORT=

DATABASE_URL=

JWT_SECRET=

AES_SECRET_KEY=

RPC_URL=

SMART_CONTRACT_ADDRESS=
```

---

# 9. Naming Convention

Folder

gunakan

kebab-case

Contoh

employee-management

---

Component

gunakan

PascalCase

Contoh

EmployeeCard.tsx

---

Function

gunakan

camelCase

Contoh

createEmployee()

---

Variable

gunakan

camelCase

Contoh

employeeScore

---

Constant

gunakan

UPPER_CASE

Contoh

MAX_SCORE

---

# 10. Module Responsibility

Frontend

↓

User Interface

---

Backend

↓

Business Logic

---

Database

↓

Operational Data

---

Smart Contract

↓

Audit Trail

---

Blockchain

↓

Immutable Storage

---

# 11. Coding Standards

Gunakan:

TypeScript

ESLint

Prettier

Async Await

REST API

SOLID Principle

---

# 12. Dependency

Frontend

- Next.js
- React
- Tailwind CSS
- Axios
- ethers.js
- React Hook Form
- Zod

Backend

- Express
- Prisma / Sequelize
- jsonwebtoken
- bcrypt
- crypto
- dotenv

Blockchain

- Solidity
- Remix IDE
- MetaMask

Database

- PostgreSQL

---

# 13. API Organization

Authentication

/api/auth

Employee

/api/employees

Evaluation

/api/evaluations

Promotion

/api/promotions

Blockchain

/api/blockchain

Dashboard

/api/dashboard

---

# 14. Upload Structure

```text
uploads/

evaluation/

promotion/
```

File yang diupload akan:

↓

AES Encrypt

↓

Database

Hash

↓

Blockchain

---

# 15. Configuration Files

Frontend

next.config.ts

tsconfig.json

package.json

---

Backend

package.json

.env

---

Smart Contract

ABI

Contract Address

Deployment Info

---

# 16. Git Branch Strategy

main

↓

production

develop

↓

development

feature/login

feature/blockchain

feature/aes

feature/dashboard

---

# 17. Deployment Structure

```text
User

↓

Frontend

(Vercel)

↓

Backend

(Railway)

↓

PostgreSQL

↓

Ethereum

↓

Smart Contract
```

---

# 18. Development Workflow

Requirement

↓

Design

↓

Database

↓

Smart Contract

↓

Backend

↓

Frontend

↓

Testing

↓

Deployment

---

# 19. Project Principles

- Separation of Concerns
- Clean Architecture
- Modular Programming
- Hybrid Blockchain
- Security by Design
- Encryption Before Storage
- Minimum On-chain Data

---

# 20. Final Project Architecture

```text
                    User
                      │
                      ▼
              Next.js Frontend
                      │
                 HTTPS REST API
                      │
              Node.js Backend
              ┌────────┴────────┐
              ▼                 ▼
        PostgreSQL         Ethereum
              │                 ▲
         AES Encryption    Smart Contract
              │
         Operational Data
```

---

# 21. Summary

Project dibangun menggunakan arsitektur modular sehingga setiap komponen memiliki tanggung jawab yang jelas.

Frontend menangani antarmuka pengguna.

Backend menangani logika bisnis.

Database menyimpan data operasional.

Smart Contract menyimpan audit trail dan status penting.

Blockchain menjamin transparansi dan integritas transaksi.