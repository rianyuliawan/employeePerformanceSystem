# 00_PROJECT_CONTEXT.md

# Employee Performance Evaluation System

## Project Vision

Employee Performance Evaluation System adalah sistem penilaian kinerja karyawan berbasis Web3 yang memanfaatkan Smart Contract Ethereum untuk menciptakan proses evaluasi yang transparan, akuntabel, dan tidak mudah dimanipulasi.

Sistem ini tidak bertujuan menggantikan database konvensional, tetapi menggabungkan teknologi blockchain dengan sistem informasi tradisional (Hybrid Architecture). Data operasional tetap disimpan pada database relasional, sedangkan blockchain digunakan sebagai media pencatatan transaksi penting (audit trail) yang memiliki sifat immutable.

Selain itu, sistem menerapkan algoritma kriptografi AES-256 untuk menjaga kerahasiaan data sensitif karyawan serta memanfaatkan fungsi hash SHA-256 dan digital signature ECDSA yang tersedia pada ekosistem Ethereum.

---

# Problem Statement

Sistem penilaian kinerja pada banyak organisasi masih menggunakan database konvensional yang memiliki beberapa kelemahan, antara lain:

* Perubahan data dapat dilakukan oleh administrator database.
* Sulit melakukan audit terhadap histori perubahan data.
* Tidak terdapat mekanisme verifikasi integritas dokumen evaluasi.
* Data evaluasi mengandung informasi sensitif yang harus dilindungi.
* Proses promosi dan pemberian bonus sering dipertanyakan karena kurang transparan.

Walaupun database modern telah menyediakan audit log, administrator dengan hak akses tinggi masih berpotensi melakukan manipulasi terhadap data maupun histori audit.

---

# Proposed Solution

Sistem yang dibangun menggunakan pendekatan Hybrid Architecture.

## Database

Digunakan untuk menyimpan:

* Data identitas karyawan
* Data divisi
* Data jabatan
* Dokumen evaluasi
* Dokumen promosi
* Data operasional lainnya

Data sensitif dienkripsi menggunakan AES-256 sebelum disimpan.

---

## Blockchain

Digunakan untuk mencatat:

* Hasil akhir evaluasi
* Hash dokumen evaluasi
* Approval manager
* Approval HR
* Riwayat promosi
* Timestamp transaksi
* Wallet address evaluator

Karena blockchain memiliki karakteristik immutable, histori transaksi tidak dapat diubah setelah berhasil dikonfirmasi.

---

# Why Blockchain?

Blockchain digunakan bukan sebagai pengganti database.

Blockchain digunakan untuk menyediakan:

* Audit Trail
* Transparency
* Immutability
* Traceability
* Non-Repudiation

Dengan demikian organisasi dapat melakukan audit terhadap seluruh aktivitas penting tanpa harus mempercayai administrator database sepenuhnya.

---

# Why AES-256?

Blockchain bersifat publik.

Menyimpan data pribadi secara langsung di blockchain berpotensi melanggar prinsip kerahasiaan data.

Oleh karena itu seluruh data sensitif disimpan pada database setelah melalui proses enkripsi menggunakan AES-256.

AES dipilih karena:

* Merupakan standar enkripsi internasional.
* Digunakan secara luas pada industri.
* Mendukung proses enkripsi dan dekripsi (symmetric encryption).
* Memiliki performa tinggi.
* Sangat sesuai untuk melindungi data dalam database.

---

# Project Goals

Tujuan utama proyek adalah:

1. Membangun sistem penilaian kinerja karyawan berbasis Web3.

2. Mengimplementasikan Smart Contract Ethereum untuk mencatat aktivitas penting yang membutuhkan transparansi.

3. Mengimplementasikan AES-256 sebagai mekanisme perlindungan data sensitif.

4. Mengimplementasikan SHA-256 sebagai mekanisme verifikasi integritas dokumen.

5. Memanfaatkan Digital Signature Ethereum (ECDSA) untuk memastikan autentikasi transaksi.

6. Menghasilkan sistem yang realistis, efisien, dan dapat diimplementasikan pada lingkungan perusahaan.

---

# Scope of Project

Project ini mencakup:

* Employee Management
* Performance Evaluation
* Promotion Management
* Reward Recommendation
* Smart Contract Integration
* AES Encryption
* SHA-256 Hash Verification
* Blockchain Audit Trail
* Dashboard Monitoring

Project ini tidak mencakup:

* Payroll
* Attendance System
* Recruitment System
* Accounting
* ERP

---

# Target Users

## Human Resource

Mengelola data karyawan.

---

## Manager

Melakukan evaluasi kinerja.

---

## Director

Melakukan approval promosi.

---

## Employee

Melihat hasil evaluasi pribadi.

---

# Project Principles

Seluruh keputusan desain sistem mengikuti prinsip berikut.

## Hybrid Architecture

Blockchain tidak digunakan sebagai database utama.

---

## Security First

Seluruh data sensitif wajib dienkripsi.

---

## Transparency

Seluruh aktivitas penting harus dapat diaudit.

---

## Scalability

Data operasional tetap menggunakan database relasional agar sistem tetap efisien.

---

## Practical Web3

Blockchain hanya digunakan apabila benar-benar memberikan nilai tambah.

---

# Cryptography Overview

Project mengimplementasikan tiga jenis kriptografi.

## AES-256

Fungsi:

Confidentiality

Digunakan untuk:

* Email
* Phone Number
* Address
* Evaluation Report
* Promotion Document

---

## SHA-256

Fungsi:

Integrity

Digunakan untuk:

* Hash Evaluation Report
* Hash Promotion Document

Hash akan disimpan pada blockchain.

---

## ECDSA

Fungsi:

Authentication

Non-Repudiation

Digunakan melalui wallet Ethereum (MetaMask) ketika melakukan transaksi smart contract.

---

# Technology Stack

Frontend

* Next.js
* React
* Tailwind CSS

Backend

* Node.js
* Express.js

Blockchain

* Solidity
* Remix IDE
* Ethereum Sepolia

Wallet

* MetaMask

Database

* PostgreSQL

Cryptography

* AES-256
* SHA-256
* ECDSA

Deployment

* Vercel
* Railway / Render
* Sepolia Testnet

---

# Development Strategy

Tahap pengembangan dilakukan secara bertahap.

Phase 1

Project Planning

Phase 2

Database Design

Phase 3

Smart Contract Development

Phase 4

Backend Development

Phase 5

AES Encryption

Phase 6

Frontend Development

Phase 7

Blockchain Integration

Phase 8

Testing

Phase 9

Deployment

---

# Expected Outcome

Sistem yang dihasilkan diharapkan mampu:

* meningkatkan transparansi proses evaluasi,
* melindungi data sensitif menggunakan AES-256,
* menyediakan audit trail permanen menggunakan blockchain,
* menjamin integritas dokumen melalui SHA-256,
* memanfaatkan smart contract sebagai mekanisme validasi dan pencatatan transaksi penting,
* memberikan contoh implementasi Web3 yang realistis pada sistem informasi perusahaan.

---

# References

Referensi utama yang digunakan dalam pengembangan sistem:

* Blockchain Adoption in Government and Public Services (ACM Digital Library).
* Ethereum Documentation.
* Solidity Documentation.
* Remix IDE Documentation.
* AES (Advanced Encryption Standard) - NIST FIPS 197.
* SHA-256 - NIST Secure Hash Standard.
* MetaMask Documentation.
