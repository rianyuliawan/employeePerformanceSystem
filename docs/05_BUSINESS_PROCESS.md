# 05_BUSINESS_PROCESS.md

# Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan seluruh proses bisnis yang terjadi pada Employee Performance Evaluation System mulai dari pengelolaan data karyawan, proses evaluasi, approval, hingga pencatatan transaksi ke blockchain.

Seluruh proses dirancang menggunakan pendekatan Hybrid Architecture, yaitu kombinasi antara database relasional dan Smart Contract Ethereum.

---

# 2. Business Process Overview

Sistem memiliki lima proses bisnis utama.

1. Employee Management
2. Performance Evaluation
3. Evaluation Approval
4. Promotion Management
5. Blockchain Audit Trail

---

# 3. Employee Management

## Description

HR bertanggung jawab mengelola seluruh data karyawan.

---

## Workflow

```text
HR Login

↓

Open Employee Menu

↓

Create / Update / Delete Employee

↓

Backend Validation

↓

AES Encrypt Sensitive Data

↓

Save PostgreSQL

↓

Success
```

---

## Data Stored

Database:

* Employee ID
* Name
* Email (AES)
* Phone Number (AES)
* Address (AES)
* Department
* Position

Blockchain:

Tidak ada.

---

# 4. Performance Evaluation

## Description

Manager memberikan penilaian terhadap karyawan berdasarkan indikator KPI.

---

## Evaluation Components

* Discipline
* Communication
* Leadership
* Teamwork
* Responsibility
* Productivity
* Initiative
* Comment

---

## Workflow

```text
Manager Login

↓

Choose Employee

↓

Input KPI Score

↓

Input Evaluation Comment

↓

Upload Evaluation Document

↓

Submit Evaluation
```

Backend

↓

Validate Data

↓

AES Encrypt Evaluation Report

↓

Save PostgreSQL

↓

Generate SHA-256

↓

Send Hash to Smart Contract

↓

Transaction Success

---

## Stored Data

Database

* KPI Score
* Evaluation Comment (AES)
* Evaluation Document (AES)

Blockchain

* Evaluation ID
* SHA-256 Hash
* Manager Wallet
* Timestamp

---

# 5. Evaluation Approval

## Description

HR melakukan verifikasi terhadap hasil evaluasi.

---

## Workflow

```text
HR Login

↓

Review Evaluation

↓

Approve

or

Reject
```

Jika Approve

↓

Generate Approval Hash

↓

Blockchain

↓

Update Database

---

## Blockchain Data

* Evaluation ID
* Approval Status
* Wallet HR
* Timestamp

---

# 6. Promotion Process

## Description

Promosi dilakukan berdasarkan hasil evaluasi yang telah disetujui.

---

## Workflow

```text
Manager Recommendation

↓

HR Review

↓

Director Approval

↓

Promotion Approved

↓

Save Database

↓

Generate Promotion Hash

↓

Smart Contract

↓

Blockchain Event
```

---

## Stored Data

Database

* New Position
* Salary Grade
* Promotion Date

Blockchain

* Promotion ID
* Employee ID
* Promotion Hash
* Director Wallet
* Timestamp

---

# 7. Blockchain Audit Trail

Blockchain digunakan sebagai audit log permanen.

Seluruh transaksi penting akan menghasilkan event.

Contoh:

Employee Evaluated

Evaluation Approved

Promotion Approved

Document Verified

---

# 8. Cryptography Process

## Step 1

Manager mengisi evaluasi.

↓

Plaintext

---

## Step 2

Backend melakukan:

AES-256 Encrypt

↓

Ciphertext

↓

Database

---

## Step 3

Backend menghasilkan:

SHA-256

↓

Hash

↓

Smart Contract

---

## Step 4

Smart Contract

↓

Blockchain

↓

Transaction Receipt

---

# 9. Document Verification Process

Ketika auditor ingin memverifikasi dokumen.

Workflow

```text
Download Document

↓

AES Decrypt

↓

Generate SHA-256

↓

Compare

↓

Blockchain Hash
```

Jika sama

↓

Document Valid

Jika berbeda

↓

Document Modified

---

# 10. Authentication Process

```text
User Login

↓

Email Password

↓

JWT

↓

Dashboard
```

Untuk transaksi blockchain

```text
Click Submit

↓

MetaMask

↓

ECDSA Signature

↓

Smart Contract
```

---

# 11. Business Rules

BR-01

Employee hanya dapat melihat hasil evaluasinya sendiri.

---

BR-02

Manager hanya dapat mengevaluasi anggota timnya.

---

BR-03

HR dapat melihat seluruh evaluasi.

---

BR-04

Director hanya memberikan approval promosi.

---

BR-05

Seluruh dokumen evaluasi harus dienkripsi menggunakan AES-256.

---

BR-06

Seluruh hash dokumen disimpan di blockchain.

---

BR-07

Blockchain tidak menyimpan data pribadi karyawan.

---

BR-08

Hash hanya dibuat setelah dokumen berhasil disimpan.

---

BR-09

Apabila transaksi blockchain gagal, data evaluasi tetap tersimpan di database dengan status **Pending Blockchain Sync** sehingga dapat dikirim ulang.

---

BR-10

Seluruh transaksi blockchain menghasilkan event.

---

# 12. Exception Handling

## MetaMask ditolak

↓

Transaksi dibatalkan.

---

## Blockchain gagal

↓

Status:

Pending Blockchain Sync

---

## Database gagal

↓

Rollback Transaction

---

## Hash tidak sesuai

↓

Dokumen dianggap telah dimodifikasi.

---

## AES gagal

↓

Data tidak disimpan.

---

# 13. Process Summary

| Process      | Database | Blockchain |
| ------------ | -------- | ---------- |
| Employee     | ✔        | ✖          |
| Evaluation   | ✔        | ✔          |
| Approval     | ✔        | ✔          |
| Promotion    | ✔        | ✔          |
| Dashboard    | ✔        | ✖          |
| Verification | ✔        | ✔          |

---

# 14. End-to-End Business Process

```text
HR
│
├── Register Employee
│
Manager
│
├── Evaluate Employee
│
Backend
│
├── AES Encrypt
├── Save Database
├── SHA-256 Hash
│
Smart Contract
│
├── Save Hash
├── Emit Event
│
Blockchain
│
HR
│
├── Review Evaluation
│
Director
│
├── Approve Promotion
│
Backend
│
├── Update Database
├── Generate Promotion Hash
│
Smart Contract
│
└── Promotion Event
```

---

# 15. Business Value

Implementasi proses bisnis ini memberikan manfaat:

* Transparansi proses evaluasi.
* Riwayat transaksi yang tidak dapat dimanipulasi.
* Perlindungan data sensitif menggunakan AES-256.
* Verifikasi integritas dokumen melalui SHA-256.
* Audit trail permanen menggunakan Smart Contract Ethereum.
* Arsitektur hybrid yang efisien sehingga biaya blockchain tetap rendah.
