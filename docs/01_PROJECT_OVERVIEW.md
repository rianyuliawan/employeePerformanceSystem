# 01_PROJECT_OVERVIEW.md

# Employee Performance Evaluation System

Version : 1.0

---

# 1. Overview

Employee Performance Evaluation System merupakan aplikasi berbasis Web3 yang dirancang untuk membantu perusahaan dalam melakukan proses penilaian kinerja karyawan secara transparan, aman, dan terdokumentasi.

Sistem menggabungkan teknologi Smart Contract Ethereum, algoritma kriptografi AES-256, serta database relasional untuk membangun sistem evaluasi yang efisien namun tetap memiliki audit trail permanen.

Blockchain digunakan sebagai media pencatatan aktivitas penting, sedangkan data operasional tetap disimpan pada database konvensional.

---

# 2. System Objectives

Tujuan sistem adalah:

* Mempermudah proses penilaian karyawan.
* Mengurangi potensi manipulasi hasil evaluasi.
* Menyediakan histori penilaian yang transparan.
* Melindungi data sensitif menggunakan AES-256.
* Menjamin integritas dokumen menggunakan SHA-256.
* Menyediakan audit trail menggunakan Smart Contract Ethereum.

---

# 3. Main Features

## Authentication

* Login menggunakan Email & Password
* Login menggunakan MetaMask
* Wallet Verification

---

## Employee Management

* Register Employee
* Update Employee
* Delete Employee
* View Employee
* Department Management
* Position Management

---

## Performance Evaluation

Manager dapat:

* Memberikan nilai KPI
* Memberikan komentar evaluasi
* Memberikan rekomendasi promosi
* Mengunggah dokumen evaluasi

---

## Promotion Management

HR dapat:

* Menyetujui promosi
* Menolak promosi
* Memberikan bonus
* Mengubah jabatan

---

## Audit Trail

Smart Contract mencatat:

* Evaluasi dibuat
* Evaluasi disetujui
* Promosi
* Bonus
* Timestamp
* Wallet evaluator

---

## Dashboard

Dashboard menyediakan:

* Statistik penilaian
* Statistik divisi
* Grafik performa
* Riwayat promosi

---

# 4. User Roles

## Human Resource

Hak akses:

* Mengelola data karyawan
* Approval promosi
* Approval bonus
* Monitoring evaluasi

---

## Manager

Hak akses:

* Memberikan penilaian
* Upload dokumen evaluasi
* Melihat histori tim

---

## Director

Hak akses:

* Approval akhir promosi
* Approval bonus

---

## Employee

Hak akses:

* Melihat profil
* Melihat histori evaluasi
* Mengunduh laporan pribadi

---

# 5. Functional Requirements

## Employee

Sistem harus mampu:

* Menambah data karyawan
* Mengubah data karyawan
* Menghapus data karyawan
* Menampilkan data karyawan

---

## Evaluation

Sistem harus mampu:

* Membuat evaluasi baru
* Mengubah evaluasi
* Menyimpan komentar
* Menghitung total nilai
* Menghasilkan rekomendasi promosi

---

## Smart Contract

Sistem harus mampu:

* Menyimpan hash evaluasi
* Menyimpan skor akhir
* Menyimpan approval
* Menghasilkan event blockchain

---

## Cryptography

Sistem harus mampu:

* Mengenkripsi data sensitif menggunakan AES-256
* Mendekripsi data ketika diperlukan
* Menghasilkan hash SHA-256
* Mengirim hash ke blockchain

---

# 6. Non Functional Requirements

## Performance

* Response < 3 detik
* Blockchain transaction asynchronous

---

## Security

* AES-256 Encryption
* SHA-256 Hash
* ECDSA Signature
* HTTPS
* JWT Authentication

---

## Availability

* Sistem dapat berjalan 24 jam
* Smart Contract selalu tersedia selama blockchain aktif

---

## Scalability

Database dapat dikembangkan tanpa memengaruhi blockchain.

---

# 7. Hybrid Architecture

## Database

Menyimpan:

* Employee
* Department
* Position
* Evaluation Report
* Promotion Document

---

## Blockchain

Menyimpan:

* Evaluation Score
* Approval
* Hash Document
* Timestamp
* Wallet Address

---

# 8. Cryptography Workflow

## Encryption

Employee Evaluation

↓

AES-256 Encryption

↓

Database

---

## Integrity Verification

Employee Evaluation

↓

SHA-256

↓

Hash

↓

Blockchain

---

## Authentication

Wallet

↓

ECDSA

↓

Smart Contract

---

# 9. High Level Workflow

Manager Login

↓

Input Evaluation

↓

AES Encrypt Report

↓

Save Database

↓

Generate SHA-256

↓

Send Hash

↓

Smart Contract

↓

Blockchain

↓

Event Created

---

# 10. Expected Benefits

Perusahaan memperoleh:

* Transparansi proses evaluasi.
* Riwayat penilaian permanen.
* Integritas dokumen.
* Perlindungan data sensitif.
* Audit yang mudah dilakukan.

---

# 11. Limitations

Versi pertama sistem belum mendukung:

* Multi Signature Approval
* IPFS
* Mobile Application
* AI Recommendation
* Multi Company
* Multi Blockchain

---

# 12. Success Criteria

Project dinyatakan berhasil apabila:

✅ Seluruh data sensitif berhasil dienkripsi menggunakan AES-256.

✅ Smart Contract berhasil mencatat transaksi evaluasi.

✅ Hash dokumen berhasil diverifikasi.

✅ Wallet MetaMask dapat melakukan transaksi.

✅ Frontend berhasil berkomunikasi dengan Smart Contract.

✅ Dashboard mampu menampilkan histori evaluasi secara lengkap.

---

# 13. Future Improvements

Versi selanjutnya dapat dikembangkan menjadi:

* Multi Signature Promotion
* AI Performance Recommendation
* Decentralized Storage (IPFS)
* Notification System
* Blockchain Analytics
* Mobile Application
* Multi Organization Support
* Single Sign On (SSO)
* ERP Integration
