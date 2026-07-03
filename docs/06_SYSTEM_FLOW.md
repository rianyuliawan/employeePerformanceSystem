# 06_SYSTEM_FLOW.md

# System Flow

## Employee Performance Evaluation System

Version 2.0

---

# 1. Overview

Dokumen ini menjelaskan alur proses (System Flow) pada Employee Performance Evaluation System mulai dari autentikasi pengguna hingga pencatatan transaksi pada blockchain.

Flow dirancang berdasarkan:

- Hybrid Architecture
- Clean Architecture
- REST API
- AES-256 Encryption
- SHA-256 Integrity Verification
- Ethereum Smart Contract

Dokumen ini menjadi acuan dalam pembuatan:

- Activity Diagram
- Sequence Diagram
- Flowchart
- Backend Service
- API Flow

---

# 2. Overall System Flow

```
                    User
                      │
                      ▼
              Next.js Frontend
                      │
                HTTPS REST API
                      │
                      ▼
                 Express Router
                      │
       ┌──────────────┼───────────────┐
       ▼                              ▼
Authentication                  Business Process
       │                              │
       ▼                              ▼
 Authorization                 Business Service
                                      │
              ┌───────────────────────┼────────────────────────┐
              ▼                       ▼                        ▼
     Encryption Service        Repository Layer        Blockchain Service
              │                       │                        │
              ▼                       ▼                        ▼
         AES-256 Encrypt         PostgreSQL             Smart Contract
                                      │                        │
                                      ▼                        ▼
                             Operational Data          Ethereum Sepolia
```

---

# 3. Login Flow

```
User

↓

Input Email

↓

Input Password

↓

Authentication Middleware

↓

Database

↓

Password Verification

↓

Generate JWT

↓

Dashboard
```

Jika gagal

↓

Unauthorized

---

# 4. Employee Management Flow

```
HR

↓

Employee Page

↓

Submit Form

↓

Validation

↓

Employee Controller

↓

Employee Service

↓

Employee Repository

↓

PostgreSQL

↓

Success
```

Blockchain tidak digunakan pada proses ini.

---

# 5. Performance Evaluation Flow

Manager melakukan evaluasi.

```
Manager

↓

Input KPI

↓

Input Comment

↓

Upload Evaluation Document

↓

Submit
```

Backend

↓

Validation

↓

Evaluation Controller

↓

Evaluation Service

↓

AES Encrypt Comment

↓

Employee Repository

↓

PostgreSQL

↓

Generate SHA-256

↓

Blockchain Service

↓

Smart Contract

↓

Event

↓

Update Transaction Hash

↓

Success
```

---

# 6. Smart Contract Flow

Blockchain hanya menerima data yang diperlukan.

```
Evaluation Service

↓

Hash Service

↓

SHA-256

↓

Blockchain Service

↓

ethers.js

↓

MetaMask Signature

↓

Smart Contract

↓

Blockchain Event
```

---

# 7. Evaluation Lifecycle

Smart Contract mengelola status evaluasi.

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

Setiap perubahan status menghasilkan event blockchain.

---

# 8. Promotion Flow

```
Manager

↓

Recommend Promotion

↓

HR Review

↓

Director Approval

↓

Promotion Service

↓

Promotion Repository

↓

Database

↓

Generate SHA-256

↓

Blockchain Service

↓

Smart Contract

↓

Promotion Event
```

---

# 9. AES Encryption Flow

```
Plaintext

↓

Encryption Service

↓

AES-256

↓

Ciphertext

↓

Database
```

Saat data dibaca.

```
Database

↓

Ciphertext

↓

AES Decrypt

↓

Plaintext

↓

Frontend
```

---

# 10. SHA-256 Flow

```
Evaluation Document

↓

SHA-256

↓

Hash

↓

Smart Contract
```

Hash digunakan untuk:

- Integrity Verification
- Audit Trail

---

# 11. Document Verification Flow

```
Download Evaluation

↓

AES Decrypt

↓

Generate SHA-256

↓

Compare

↓

Blockchain Hash

↓

Valid

atau

Invalid
```

---

# 12. Blockchain Synchronization

Sistem menggunakan asynchronous synchronization.

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

---

# 13. Blockchain Failure Recovery

Jika transaksi blockchain gagal.

```
Save Database

↓

Blockchain Failed

↓

Status

Pending Blockchain Sync

↓

Retry Queue

↓

Blockchain Service

↓

Success
```

Data operasional tidak hilang.

---

# 14. API Flow

```
Frontend

↓

Route

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

# 15. Dashboard Flow

```
Dashboard

↓

Dashboard API

↓

Dashboard Service

↓

Repository

↓

Database

↓

Statistics

↓

Frontend
```

Blockchain digunakan untuk:

- Latest Transaction
- Evaluation Status
- Promotion Status

---

# 16. Error Handling Flow

Validation Error

↓

400 Bad Request

---

Authentication Error

↓

401 Unauthorized

---

Authorization Error

↓

403 Forbidden

---

Database Error

↓

Rollback Transaction

---

Blockchain Error

↓

Pending Blockchain Sync

---

AES Error

↓

Cancel Transaction

---

# 17. Complete System Flow

```
Manager Login
      │
      ▼
Authentication
      │
      ▼
JWT Generated
      │
      ▼
Dashboard
      │
      ▼
Input Evaluation
      │
      ▼
Validation
      │
      ▼
Evaluation Controller
      │
      ▼
Evaluation Service
      │
      ├──────────────┐
      ▼              ▼
AES Encrypt     Evaluation Repository
      │              │
      ▼              ▼
Database       Save Evaluation
      │
      ▼
SHA-256
      │
      ▼
Blockchain Service
      │
      ▼
MetaMask
      │
      ▼
Smart Contract
      │
      ▼
Emit Event
      │
      ▼
Save Transaction Hash
      │
      ▼
Return Success
```

---

# 18. Design Principles

System Flow mengikuti prinsip berikut.

- Clean Architecture
- Single Responsibility
- Asynchronous Blockchain Transaction
- Encryption Before Storage
- Hash Before Blockchain
- Minimal On-chain Data
- Retry Mechanism
- Immutable Audit Trail

---

# 19. Summary

System Flow memisahkan proses operasional perusahaan dengan proses blockchain.

Data operasional disimpan terlebih dahulu pada PostgreSQL setelah melalui proses enkripsi AES-256.

Setelah data berhasil tersimpan, sistem menghasilkan hash SHA-256 yang kemudian dikirim ke Smart Contract Ethereum sebagai audit trail.

Pendekatan ini menghasilkan sistem yang:

- Aman
- Skalabel
- Efisien
- Mudah dipelihara
- Siap dikembangkan menjadi aplikasi enterprise.