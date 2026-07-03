# 12_TESTING_GUIDE.md

# Testing Documentation

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan metode pengujian yang digunakan pada Employee Performance Evaluation System.

Pengujian dilakukan untuk memastikan seluruh komponen sistem berjalan sesuai kebutuhan fungsional maupun non-fungsional.

Komponen yang diuji meliputi:

* Frontend
* Backend
* Database
* AES Encryption
* SHA-256 Hash
* Smart Contract
* Blockchain Integration
* API

---

# 2. Testing Scope

Komponen yang diuji:

* User Authentication
* Employee Management
* Performance Evaluation
* Promotion
* AES Encryption
* SHA-256 Verification
* Smart Contract
* MetaMask Integration
* Blockchain Transaction

---

# 3. Testing Method

Metode pengujian yang digunakan:

* Black Box Testing
* Integration Testing
* User Acceptance Testing (UAT)

---

# 4. Authentication Testing

## Test Case TC-001

### Scenario

Login menggunakan akun yang valid.

Expected Result

* Login berhasil.
* JWT dibuat.
* Dashboard ditampilkan.

Status

PASS

---

## Test Case TC-002

Scenario

Password salah.

Expected

* Login gagal.
* Error Message muncul.

Status

PASS

---

# 5. Employee Testing

## TC-003

Scenario

Tambah data karyawan.

Expected

Data tersimpan ke database.

Status

PASS

---

## TC-004

Scenario

Update data karyawan.

Expected

Data berhasil diperbarui.

Status

PASS

---

## TC-005

Scenario

Hapus data karyawan.

Expected

Data berhasil dihapus.

Status

PASS

---

# 6. AES Encryption Testing

## TC-006

Scenario

Simpan komentar evaluasi.

Expected

Komentar tersimpan dalam bentuk ciphertext.

Status

PASS

---

## TC-007

Scenario

Buka kembali komentar evaluasi.

Expected

Ciphertext berhasil didekripsi menjadi plaintext.

Status

PASS

---

## TC-008

Scenario

AES Key salah.

Expected

Dekripsi gagal.

Status

PASS

---

# 7. SHA-256 Testing

## TC-009

Scenario

Generate hash dokumen.

Expected

Hash berhasil dibuat.

Status

PASS

---

## TC-010

Scenario

Dokumen dimodifikasi.

Expected

Hash berubah.

Status

PASS

---

## TC-011

Scenario

Verifikasi hash.

Expected

Hash cocok.

Status

PASS

---

# 8. Smart Contract Testing

## TC-012

Scenario

Create Evaluation.

Expected

Transaction berhasil.

Event muncul.

Status

PASS

---

## TC-013

Scenario

Approve Evaluation.

Expected

Approval tercatat.

Status

PASS

---

## TC-014

Scenario

Approve Promotion.

Expected

Promotion Event muncul.

Status

PASS

---

# 9. MetaMask Testing

## TC-015

Scenario

Connect Wallet.

Expected

Wallet berhasil terhubung.

Status

PASS

---

## TC-016

Scenario

User menolak transaksi.

Expected

Transaksi dibatalkan.

Status

PASS

---

# 10. Blockchain Testing

## TC-017

Scenario

Transaction berhasil.

Expected

Transaction Hash tersedia.

Status

PASS

---

## TC-018

Scenario

Event berhasil dibuat.

Expected

Blockchain Event muncul.

Status

PASS

---

## TC-019

Scenario

Blockchain gagal diakses.

Expected

Status menjadi:

Pending Blockchain Sync

Status

PASS

---

# 11. API Testing

## Authentication API

* POST /login

---

## Employee API

* GET /employees

* POST /employees

* PUT /employees/{id}

* DELETE /employees/{id}

---

## Evaluation API

* POST /evaluations

* GET /evaluations

---

## Promotion API

* POST /promotions

* GET /promotions

---

# 12. Database Testing

Pengujian:

* Insert
* Update
* Delete
* Foreign Key
* Constraint

Semua query harus berhasil dijalankan.

---

# 13. Integration Testing

Komponen yang diuji:

Frontend

↓

Backend

↓

Database

↓

AES

↓

SHA-256

↓

Smart Contract

↓

Blockchain

Semua proses harus berjalan tanpa error.

---

# 14. Performance Testing

Target:

Login

< 2 detik

Dashboard

< 3 detik

API

< 2 detik

Blockchain

Tergantung kondisi jaringan Ethereum Sepolia.

---

# 15. Security Testing

Pengujian:

* JWT Authentication
* AES Encryption
* SHA-256 Integrity
* Wallet Authentication
* Smart Contract Access

---

# 16. User Acceptance Testing

Pengguna mencoba:

* Login
* Tambah Karyawan
* Buat Evaluasi
* Approval
* Promosi
* Dashboard

Kriteria keberhasilan:

Seluruh fungsi dapat digunakan sesuai kebutuhan pengguna.

---

# 17. Test Environment

Frontend

Next.js

Backend

Node.js

Database

PostgreSQL

Blockchain

Ethereum Sepolia

Wallet

MetaMask

Browser

Google Chrome

---

# 18. Success Criteria

Sistem dianggap berhasil apabila:

* Semua test case berstatus PASS.
* AES berhasil mengenkripsi dan mendekripsi data.
* SHA-256 menghasilkan hash yang konsisten.
* Smart Contract berhasil mencatat transaksi.
* MetaMask berhasil melakukan digital signature.
* Dashboard menampilkan data dengan benar.
* Integrasi antar komponen berjalan tanpa kesalahan.

---

# 19. Future Testing

Pengujian yang dapat dilakukan pada pengembangan selanjutnya:

* Load Testing
* Stress Testing
* Penetration Testing
* Smart Contract Security Audit
* Gas Consumption Analysis
* Multi-user Concurrency Testing

---

# 20. Testing Summary

Pengujian dilakukan pada seluruh komponen sistem menggunakan pendekatan Black Box Testing, Integration Testing, dan User Acceptance Testing.

Hasil pengujian diharapkan menunjukkan bahwa sistem mampu:

* Mengelola data karyawan.
* Melindungi data sensitif menggunakan AES-256.
* Memverifikasi integritas dokumen menggunakan SHA-256.
* Mencatat transaksi penting melalui Smart Contract Ethereum.
* Menyediakan audit trail yang transparan dan tidak dapat dimanipulasi.
