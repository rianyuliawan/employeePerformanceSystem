# 10_FRONTEND_GUIDE.md

# Frontend Design Documentation

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Frontend dibangun menggunakan Next.js sebagai antarmuka utama antara pengguna dengan sistem.

Frontend bertanggung jawab untuk:

* Menampilkan data.
* Mengelola interaksi pengguna.
* Menghubungkan MetaMask.
* Berkomunikasi dengan Backend API.
* Berinteraksi dengan Smart Contract menggunakan ethers.js.

Frontend **tidak melakukan proses enkripsi maupun penyimpanan data**.

Seluruh proses bisnis dijalankan oleh Backend API.

---

# 2. Technology Stack

Framework

* Next.js 15

Library

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* ethers.js
* Axios
* React Hook Form
* Zod

Wallet

* MetaMask

---

# 3. Folder Structure

```text
frontend/

├── app/
│
├── components/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── types/
│
├── providers/
│
├── store/
│
├── utils/
│
├── public/
│
└── middleware.ts
```

---

# 4. Routing Structure

```text
/

├── login

├── dashboard

├── employees

├── evaluations

├── promotions

├── blockchain

├── profile

├── settings

└── reports
```

---

# 5. Authentication Flow

```text
User

↓

Login

↓

Backend API

↓

JWT Token

↓

Save Session

↓

Dashboard
```

---

# 6. Wallet Connection

Workflow

```text
Dashboard

↓

Connect Wallet

↓

MetaMask

↓

Approve

↓

Wallet Connected
```

Setelah wallet terhubung.

Frontend akan menyimpan:

* Wallet Address
* Network
* Connection Status

---

# 7. Frontend Pages

## Login

Fitur:

* Email
* Password
* Login Button

---

## Dashboard

Menampilkan:

* Total Employee
* Total Evaluation
* Total Promotion
* Blockchain Status
* Recent Activity

---

## Employee

Fitur:

* Add Employee
* Edit Employee
* Delete Employee
* Search
* Filter

---

## Evaluation

Fitur:

* Create Evaluation
* Upload Document
* Submit Evaluation
* View History

---

## Promotion

Fitur:

* Review Evaluation
* Approve Promotion
* Reject Promotion

---

## Blockchain

Menampilkan:

* Transaction Hash
* Smart Contract Address
* Wallet
* Timestamp
* Status

---

## Profile

Menampilkan:

* Employee Information
* Wallet Address
* Position
* Department

---

## Settings

Fitur:

* Theme
* Wallet
* Password
* Profile

---

# 8. Component Structure

Reusable Components

* Navbar
* Sidebar
* Header
* Footer
* Button
* Input
* Table
* Card
* Modal
* Alert
* Badge
* Pagination
* Loading Spinner

---

# 9. API Integration

Frontend menggunakan Axios.

Contoh endpoint.

Authentication

POST

/api/auth/login

---

Employee

GET

/api/employees

POST

/api/employees

PUT

/api/employees/:id

DELETE

/api/employees/:id

---

Evaluation

POST

/api/evaluations

GET

/api/evaluations

---

Promotion

POST

/api/promotions

GET

/api/promotions

---

Blockchain

GET

/api/blockchain/history

POST

/api/blockchain/verify

---

# 10. Smart Contract Integration

Frontend menggunakan ethers.js.

Workflow

```text
Click Submit

↓

Backend Save

↓

MetaMask

↓

Sign Transaction

↓

Smart Contract

↓

Success
```

---

# 11. State Management

Global State

* User
* JWT
* Wallet
* Theme
* Notification

Local State

* Form
* Modal
* Search
* Filter

---

# 12. Validation

Frontend menggunakan:

React Hook Form

*

Zod

Validasi:

* Required Field
* Email
* Password
* Score
* File Upload

---

# 13. File Upload

Supported

* PDF

Maximum

10 MB

Workflow

```text
Upload

↓

Backend

↓

AES Encrypt

↓

Database
```

---

# 14. Dashboard Widgets

Dashboard menampilkan:

* Employee Count
* Pending Evaluation
* Approved Promotion
* Blockchain Transactions
* Recent Evaluation
* Department Statistics

---

# 15. Notification

Jenis notifikasi.

Success

Warning

Error

Info

---

# 16. Error Handling

Jika API gagal.

↓

Toast Error

Jika MetaMask ditolak.

↓

Cancel Transaction

Jika Blockchain gagal.

↓

Data Saved

Status:

Pending Blockchain Sync

---

# 17. Responsive Design

Desktop

✔

Tablet

✔

Mobile

✔

---

# 18. UI Principles

Menggunakan prinsip:

* Simple
* Modern
* Minimalist
* Responsive
* Accessible
* Consistent

---

# 19. Security

Frontend tidak pernah:

* Menyimpan AES Key
* Menyimpan Private Key
* Melakukan Encrypt
* Melakukan Decrypt

Frontend hanya:

* Mengirim Request
* Menampilkan Data
* Menghubungkan Wallet

---

# 20. Page Flow

```text
Login
   │
   ▼
Dashboard
   │
   ├────────────┐
   ▼            ▼
Employee    Evaluation
   │            │
   ▼            ▼
Promotion   Blockchain
   │            │
   └──────┬─────┘
          ▼
      Reports
```

---

# 21. User Experience

Tujuan utama frontend:

* Mudah digunakan.
* Navigasi sederhana.
* Proses evaluasi cepat.
* Integrasi blockchain tanpa mengganggu pengalaman pengguna.
* Menampilkan status sinkronisasi blockchain secara jelas.

---

# 22. Summary

Frontend berfungsi sebagai antarmuka utama sistem.

Seluruh logika bisnis dijalankan pada Backend API.

Frontend berkomunikasi dengan:

* Backend API melalui HTTPS.
* Smart Contract melalui ethers.js dan MetaMask.

Dengan pemisahan tanggung jawab ini, aplikasi menjadi lebih aman, mudah dipelihara, dan siap dikembangkan di masa mendatang.
