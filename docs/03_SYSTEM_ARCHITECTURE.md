# 03_SYSTEM_ARCHITECTURE.md

# System Architecture

## Employee Performance Evaluation System

Version 2.0

---

# 1. Overview

Employee Performance Evaluation System dibangun menggunakan **Hybrid Web2-Web3 Architecture**, yaitu menggabungkan aplikasi web konvensional dengan teknologi blockchain.

Pendekatan ini dipilih karena blockchain memiliki keunggulan dalam transparansi, audit trail, dan integritas data, namun kurang efisien sebagai media penyimpanan data operasional.

Oleh karena itu sistem membagi tanggung jawab menjadi dua bagian:

- **PostgreSQL** sebagai penyimpanan data operasional (Source of Truth).
- **Ethereum Smart Contract** sebagai penyimpanan audit trail dan status proses bisnis (Source of Audit).

---

# 2. Architecture Principles

Sistem dirancang berdasarkan prinsip berikut:

- Hybrid Architecture
- Clean Architecture
- Separation of Concerns
- Security by Design
- Defense in Depth
- Least Privilege
- Minimal On-chain Data
- Event-Driven Audit Trail

---

# 3. High Level Architecture

```
                         User
                           │
                           ▼
                  Next.js Frontend
                           │
                    HTTPS REST API
                           │
                           ▼
                     Express Backend
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Authentication      Business Logic      Smart Contract
        │                  │                  │
        ▼                  ▼                  ▼
 PostgreSQL         AES + SHA256        Ethereum Sepolia
```

---

# 4. Component Architecture

```
Client

↓

Next.js

↓

REST API

↓

Express Router

↓

Authentication Middleware

↓

Authorization Middleware

↓

Validation

↓

Controller

↓

Business Service

↓

Repository

↓

Prisma ORM

↓

PostgreSQL
```

Blockchain Service berjalan terpisah.

```
Business Service

↓

Hash Service

↓

Blockchain Service

↓

ethers.js

↓

MetaMask

↓

Smart Contract

↓

Ethereum
```

---

# 5. System Components

## Frontend Layer

Teknologi:

- Next.js
- React
- Tailwind CSS
- TypeScript
- ethers.js

Tanggung jawab:

- User Interface
- Form Input
- Dashboard
- Connect Wallet
- Menampilkan Status Blockchain
- Mengakses REST API

Frontend tidak memiliki akses langsung ke database.

---

## API Layer

Backend menggunakan Express.js.

Tanggung jawab:

- Routing
- Authentication
- Authorization
- Validation
- Error Handling

---

## Business Layer

Business Layer merupakan inti sistem.

Berisi seluruh aturan bisnis.

Contoh:

- Employee Service
- Evaluation Service
- Promotion Service
- Dashboard Service

Business Layer tidak mengetahui bagaimana database bekerja.

---

## Repository Layer

Repository bertanggung jawab terhadap komunikasi database.

Contoh:

- EmployeeRepository
- EvaluationRepository
- PromotionRepository

Repository hanya melakukan operasi CRUD.

---

## Database Layer

Menggunakan PostgreSQL.

Berfungsi menyimpan seluruh data operasional perusahaan.

---

## Blockchain Layer

Menggunakan Smart Contract Ethereum.

Berfungsi mencatat:

- Evaluation Lifecycle
- Approval History
- Promotion Status
- Document Hash
- Blockchain Event

Blockchain bukan media penyimpanan data utama.

---

# 6. Clean Architecture

```
Presentation Layer

↓

Controller

↓

Service

↓

Repository

↓

Database
```

Sedangkan blockchain berada di Service Layer.

```
Evaluation Service

├── Employee Repository

├── Evaluation Repository

├── Encryption Service

├── Hash Service

└── Blockchain Service
```

---

# 7. Hybrid Data Architecture

## PostgreSQL

Digunakan untuk menyimpan:

- Users
- Employees
- Departments
- Positions
- Evaluation Details
- Promotion Requests
- Promotion History
- Dashboard Data

---

## Smart Contract

Digunakan untuk menyimpan:

- Evaluation ID
- Evaluation Status
- Document Hash
- Transaction Timestamp
- Wallet Address
- Promotion Status

---

# 8. Cryptography Architecture

```
Employee Evaluation

        │

        ▼

AES-256 Encryption

        │

        ▼

Encrypted Database

        │

        ▼

SHA-256

        │

        ▼

Smart Contract
```

---

# 9. Authentication Architecture

Authentication terdiri dari dua mekanisme.

## Web Authentication

- Email
- Password
- JWT

Digunakan untuk login aplikasi.

---

## Blockchain Authentication

- MetaMask
- ECDSA Digital Signature

Digunakan saat melakukan transaksi blockchain.

---

# 10. Smart Contract Architecture

Smart Contract bukan database.

Smart Contract bertanggung jawab terhadap:

- State Management
- Event Logging
- Audit Trail
- Integrity Verification

State evaluasi:

```
Draft

↓

Submitted

↓

Reviewed

↓

Approved

↓

Promotion Recommended

↓

Promotion Approved
```

Setiap perubahan status menghasilkan Event.

---

# 11. Evaluation Workflow

```
Manager

↓

Input Evaluation

↓

Validation

↓

Evaluation Service

↓

AES Encrypt Comment

↓

Save PostgreSQL

↓

Generate SHA-256

↓

Blockchain Service

↓

Smart Contract

↓

Emit Event

↓

Update Transaction Hash
```

---

# 12. Promotion Workflow

```
Manager Recommendation

↓

HR Review

↓

Director Approval

↓

Promotion Service

↓

Save Database

↓

Generate SHA-256

↓

Blockchain Service

↓

Promotion Event
```

---

# 13. Error Recovery

Jika blockchain gagal.

```
Evaluation Saved

↓

Blockchain Failed

↓

Status

Pending Blockchain Sync

↓

Retry

↓

Success
```

Dengan pendekatan ini data operasional tidak hilang walaupun jaringan blockchain mengalami gangguan.

---

# 14. Security Layers

Layer 1

HTTPS

↓

Layer 2

JWT Authentication

↓

Layer 3

Role-Based Access Control

↓

Layer 4

AES-256 Encryption

↓

Layer 5

SHA-256 Integrity

↓

Layer 6

Smart Contract

↓

Layer 7

Ethereum Blockchain

---

# 15. Technology Stack

Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript
- ethers.js

Backend

- Node.js
- Express.js
- Prisma ORM

Database

- PostgreSQL

Blockchain

- Solidity
- Remix IDE
- Ethereum Sepolia

Wallet

- MetaMask

Cryptography

- AES-256
- SHA-256
- ECDSA

Deployment

- Vercel
- Railway
- PostgreSQL
- Ethereum Sepolia

---

# 16. Architectural Decisions

| Decision | Reason |
|----------|--------|
| PostgreSQL sebagai Source of Truth | Cepat, murah, mendukung transaksi kompleks |
| Smart Contract sebagai Audit Layer | Menjamin transparansi dan integritas |
| AES-256 | Melindungi data sensitif |
| SHA-256 | Verifikasi integritas dokumen |
| ECDSA | Digital Signature transaksi |
| Clean Architecture | Mempermudah maintenance dan pengujian |
| Repository Pattern | Memisahkan logika bisnis dan akses database |
| Minimal On-chain Data | Mengurangi biaya gas dan meningkatkan efisiensi |

---

# 17. Benefits

Implementasi arsitektur ini memberikan manfaat:

- Data operasional tetap cepat diakses.
- Blockchain hanya digunakan untuk proses yang membutuhkan transparansi.
- Biaya gas lebih rendah.
- Data sensitif tetap terlindungi.
- Smart Contract memiliki peran nyata sebagai pengelola status dan audit trail.
- Sistem lebih mudah dikembangkan dan dipelihara.

---

# 18. Architecture Summary

Employee Performance Evaluation System menggunakan pendekatan Hybrid Architecture yang menggabungkan keunggulan Web2 dan Web3.

PostgreSQL berfungsi sebagai sumber utama data operasional, sedangkan Smart Contract Ethereum digunakan untuk mengelola status evaluasi, mencatat audit trail, dan memverifikasi integritas dokumen.

Dengan penerapan Clean Architecture, Repository Pattern, AES-256, SHA-256, dan ECDSA, sistem memiliki fondasi yang aman, modular, dan siap dikembangkan menjadi aplikasi enterprise.