# 07_DATABASE_DESIGN.md

# Database Design

## Employee Performance Evaluation System

Version 2.0

---

# 1. Overview

Database menggunakan PostgreSQL sebagai media penyimpanan seluruh data operasional perusahaan.

Blockchain **bukan** database utama.

Database menjadi **Source of Truth**, sedangkan blockchain menjadi **Source of Audit**.

Seluruh data sensitif akan dienkripsi menggunakan AES-256 sebelum disimpan.

---

# 2. Database Design Principles

Database dirancang berdasarkan prinsip:

- Third Normal Form (3NF)
- Separation of Concerns
- Referential Integrity
- Scalability
- Security by Design

---

# 3. Database Architecture

```
Users
   │
   ▼
Employees
   │
   ├──────────────┐
   ▼              ▼
Departments   Positions
   │
   ▼
Evaluation Periods
   │
   ▼
Evaluations
   │
   ▼
Evaluation Details
   │
   ▼
Promotion Requests
   │
   ▼
Promotion History
   │
   ▼
Blockchain Transactions

Audit Logs
```

---

# 4. Entity List

Sistem terdiri dari 12 entitas utama.

| Entity | Description |
|---------|-------------|
| Users | Akun Login |
| Roles | Hak Akses |
| Employees | Data Pegawai |
| Departments | Divisi |
| Positions | Jabatan |
| Evaluation Periods | Periode Penilaian |
| Evaluations | Header Penilaian |
| Evaluation Details | Detail KPI |
| Promotion Requests | Pengajuan Promosi |
| Promotion History | Riwayat Promosi |
| Blockchain Transactions | Audit Blockchain |
| Audit Logs | Aktivitas Sistem |

---

# 5. Users

Digunakan untuk autentikasi.

| Field | Type |
|---------|------|
| id | UUID |
| employee_id | UUID |
| role_id | UUID |
| email | VARCHAR(100) |
| password_hash | TEXT |
| wallet_address | VARCHAR(255) |
| is_active | BOOLEAN |
| created_at | TIMESTAMP |

---

# 6. Roles

| Field | Type |
|---------|------|
| id | UUID |
| role_name | VARCHAR |

Contoh

- HR
- Manager
- Director
- Employee

---

# 7. Employees

| Field | Type |
|---------|------|
| id | UUID |
| employee_code | VARCHAR |
| full_name | VARCHAR |
| phone_encrypted | TEXT |
| address_encrypted | TEXT |
| department_id | UUID |
| position_id | UUID |
| hire_date | DATE |
| status | BOOLEAN |

Data terenkripsi:

- phone
- address

---

# 8. Departments

| Field | Type |
|---------|------|
| id | UUID |
| department_name | VARCHAR |

---

# 9. Positions

| Field | Type |
|---------|------|
| id | UUID |
| position_name | VARCHAR |
| level | INTEGER |

---

# 10. Evaluation Periods

Digunakan agar evaluasi dapat dilakukan setiap periode.

Contoh:

Semester 1

Semester 2

Tahunan

| Field | Type |
|---------|------|
| id | UUID |
| period_name | VARCHAR |
| start_date | DATE |
| end_date | DATE |
| status | VARCHAR |

---

# 11. Evaluations

Header penilaian.

| Field | Type |
|---------|------|
| id | UUID |
| employee_id | UUID |
| manager_id | UUID |
| period_id | UUID |
| total_score | DECIMAL |
| encrypted_comment | TEXT |
| document_path | TEXT |
| document_hash | VARCHAR |
| blockchain_status | VARCHAR |
| status | VARCHAR |
| created_at | TIMESTAMP |

Status:

- Draft
- Submitted
- Reviewed
- Approved

---

# 12. Evaluation Details

Setiap KPI disimpan pada tabel terpisah.

| Field | Type |
|---------|------|
| id | UUID |
| evaluation_id | UUID |
| indicator | VARCHAR |
| score | INTEGER |
| weight | DECIMAL |
| notes | TEXT |

Contoh

Leadership

Communication

Teamwork

Discipline

Innovation

Responsibility

---

# 13. Promotion Requests

Pengajuan promosi.

| Field | Type |
|---------|------|
| id | UUID |
| evaluation_id | UUID |
| requested_position | UUID |
| requested_by | UUID |
| status | VARCHAR |
| created_at | TIMESTAMP |

Status

Pending

Approved

Rejected

---

# 14. Promotion History

Riwayat promosi.

| Field | Type |
|---------|------|
| id | UUID |
| employee_id | UUID |
| old_position | UUID |
| new_position | UUID |
| approved_by | UUID |
| promoted_at | TIMESTAMP |

---

# 15. Blockchain Transactions

Menyimpan metadata transaksi blockchain.

| Field | Type |
|---------|------|
| id | UUID |
| evaluation_id | UUID |
| contract_address | VARCHAR |
| transaction_hash | VARCHAR |
| block_number | BIGINT |
| wallet_address | VARCHAR |
| network | VARCHAR |
| sync_status | VARCHAR |
| created_at | TIMESTAMP |

Sync Status

Pending

Success

Failed

---

# 16. Audit Logs

Digunakan untuk audit aplikasi.

| Field | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| activity | VARCHAR |
| ip_address | VARCHAR |
| created_at | TIMESTAMP |

Contoh

Login

Logout

Create Employee

Create Evaluation

Approve Promotion

---

# 17. Entity Relationship

```
Roles

↓

Users

↓

Employees

├────────────┐

▼            ▼

Departments  Positions

↓

Evaluation Periods

↓

Evaluations

↓

Evaluation Details

↓

Promotion Requests

↓

Promotion History

↓

Blockchain Transactions
```

Audit Log berdiri sendiri dan mereferensikan Users.

---

# 18. Sensitive Data

AES-256 digunakan untuk:

Employees

- phone
- address

Evaluations

- comment

Promotion

- reason (opsional)

---

# 19. Blockchain Mapping

## PostgreSQL

Menyimpan

- Employee
- KPI
- Comment
- PDF
- Promotion

## Smart Contract

Menyimpan

- Evaluation ID
- Status
- Document Hash
- Wallet
- Timestamp

---

# 20. Database Workflow

```
Manager

↓

Create Evaluation

↓

AES Encrypt

↓

PostgreSQL

↓

Generate SHA256

↓

Blockchain

↓

Transaction Hash

↓

Update blockchain_status
```

---

# 21. Database Index

Disarankan membuat index pada:

Users

- email
- wallet_address

Employees

- employee_code

Evaluations

- employee_id
- manager_id
- period_id

Blockchain Transactions

- transaction_hash

---

# 22. Security

Password

↓

bcrypt / Argon2

Sensitive Data

↓

AES-256

Document Integrity

↓

SHA-256

Blockchain Authentication

↓

ECDSA

---

# 23. Design Decisions

| Decision | Reason |
|-----------|--------|
| UUID Primary Key | Sulit ditebak dan cocok untuk sistem terdistribusi |
| Evaluation Details dipisah | KPI mudah ditambah tanpa mengubah struktur tabel |
| Evaluation Period | Mendukung penilaian berkala |
| Blockchain Transactions | Memudahkan sinkronisasi dan pelacakan transaksi |
| Audit Logs | Mendukung audit internal aplikasi |

---

# 24. Summary

Database terdiri dari 12 tabel utama yang dirancang untuk mendukung sistem penilaian kinerja karyawan secara modular, aman, dan mudah dikembangkan.

PostgreSQL menjadi sumber data operasional, sedangkan blockchain digunakan sebagai media audit trail. Data sensitif dilindungi menggunakan AES-256, integritas dokumen dijaga melalui SHA-256, dan setiap transaksi blockchain dicatat menggunakan ECDSA melalui MetaMask.