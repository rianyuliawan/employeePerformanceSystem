# 13_SECURITY_ANALYSIS.md

# Security Analysis

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan analisis keamanan pada Employee Performance Evaluation System.

Sistem dirancang menggunakan pendekatan **Defense in Depth**, yaitu menerapkan beberapa lapisan keamanan sehingga tidak bergantung pada satu mekanisme saja.

Lapisan keamanan meliputi:

* Authentication
* Authorization
* AES-256 Encryption
* SHA-256 Integrity Verification
* ECDSA Digital Signature
* Smart Contract
* HTTPS
* Database Security

---

# 2. Security Objectives

Tujuan keamanan sistem adalah:

* Melindungi data sensitif.
* Menjamin integritas data.
* Memastikan identitas pengguna.
* Menyediakan audit trail permanen.
* Mencegah manipulasi data.
* Mengurangi risiko insider threat.

---

# 3. CIA Triad

## Confidentiality

Tujuan

Melindungi informasi sensitif agar hanya dapat diakses oleh pengguna yang berwenang.

Implementasi

* AES-256 Encryption
* HTTPS
* JWT Authentication
* Role-Based Access Control (RBAC)

Data yang dilindungi:

* Nomor telepon
* Alamat
* Komentar evaluasi
* Dokumen evaluasi

---

## Integrity

Tujuan

Memastikan data tidak berubah tanpa izin.

Implementasi

* SHA-256
* Smart Contract
* Blockchain

Dokumen akan diverifikasi menggunakan hash sebelum digunakan.

---

## Availability

Tujuan

Menjamin sistem tetap tersedia ketika dibutuhkan.

Implementasi

* PostgreSQL Backup
* Retry Blockchain Synchronization
* Error Handling
* Deployment pada cloud platform

---

# 4. Authentication

Autentikasi dilakukan menggunakan:

* Email
* Password
* JWT
* MetaMask Wallet

Password tidak disimpan dalam bentuk plaintext.

Password di-hash menggunakan:

* bcrypt atau Argon2

---

# 5. Authorization

Hak akses dibagi menjadi empat role.

Employee

* View Profile
* View Evaluation

Manager

* Create Evaluation
* Upload Evaluation

HR

* Employee Management
* Approval

Director

* Final Approval

Role diterapkan pada backend dan smart contract.

---

# 6. Cryptography Security

## AES-256

Fungsi

Melindungi kerahasiaan data.

Implementasi

Backend melakukan enkripsi sebelum data disimpan.

AES Key tidak pernah dikirim ke frontend maupun blockchain.

---

## SHA-256

Fungsi

Menjamin integritas dokumen.

Hash disimpan pada blockchain.

---

## ECDSA

Fungsi

Digital Signature

Authentication

Non Repudiation

Digunakan melalui MetaMask.

---

# 7. Blockchain Security

Blockchain digunakan untuk:

* Audit Trail
* Integrity Verification
* Immutable Transaction History

Blockchain tidak menyimpan:

* Password
* Data pribadi
* Dokumen
* File

---

# 8. Threat Analysis

## Threat 1

Unauthorized Access

Risiko

Pengguna tanpa hak mencoba mengakses sistem.

Mitigasi

* JWT
* RBAC
* Session Validation

---

## Threat 2

Database Manipulation

Risiko

Administrator database mengubah hasil evaluasi.

Mitigasi

* SHA-256 Hash
* Blockchain Verification
* Audit Trail

---

## Threat 3

Sensitive Data Leakage

Risiko

Database bocor.

Mitigasi

AES-256 Encryption.

---

## Threat 4

Document Modification

Risiko

Dokumen evaluasi diubah setelah disetujui.

Mitigasi

Generate SHA-256.

Bandingkan dengan hash blockchain.

---

## Threat 5

Replay Transaction

Risiko

Transaksi blockchain dikirim ulang.

Mitigasi

Nonce Ethereum.

---

## Threat 6

Wallet Impersonation

Risiko

Seseorang berpura-pura menjadi Manager.

Mitigasi

ECDSA Digital Signature.

---

## Threat 7

Private Key Exposure

Risiko

Private Key bocor.

Mitigasi

Private Key hanya berada di MetaMask.

Tidak pernah disimpan oleh sistem.

---

# 9. Security Layer

```text
Layer 1

HTTPS

↓

Layer 2

Authentication

↓

Layer 3

Authorization

↓

Layer 4

AES Encryption

↓

Layer 5

SHA-256 Verification

↓

Layer 6

Smart Contract

↓

Layer 7

Blockchain Audit Trail
```

---

# 10. Secure Data Flow

```text
Manager

↓

Frontend

↓

HTTPS

↓

Backend

↓

AES Encrypt

↓

Database

↓

SHA-256

↓

Smart Contract

↓

Blockchain
```

---

# 11. Security Best Practices

* Password menggunakan bcrypt atau Argon2.
* AES Key disimpan pada environment variable.
* JWT memiliki masa berlaku.
* Private Key tidak disimpan pada backend.
* Seluruh komunikasi menggunakan HTTPS.
* Smart Contract hanya menyimpan data minimum.
* Database melakukan backup berkala.

---

# 12. Security Limitations

Sistem masih memiliki keterbatasan:

* Belum menggunakan Multi-Factor Authentication (MFA).
* Belum menerapkan Hardware Security Module (HSM) untuk penyimpanan kunci.
* Belum dilakukan Smart Contract Security Audit oleh pihak ketiga.
* Belum menggunakan Multi-Signature Wallet.

---

# 13. Compliance

Desain sistem mengacu pada prinsip:

* CIA Triad
* Principle of Least Privilege
* Defense in Depth
* Secure by Design

---

# 14. Security Evaluation

Keamanan sistem dievaluasi berdasarkan:

| Aspek           | Implementasi             |
| --------------- | ------------------------ |
| Confidentiality | AES-256                  |
| Integrity       | SHA-256 + Blockchain     |
| Authentication  | JWT + MetaMask           |
| Authorization   | RBAC                     |
| Non-Repudiation | ECDSA                    |
| Auditability    | Smart Contract           |
| Availability    | Backup & Retry Mechanism |

---

# 15. Security Summary

Employee Performance Evaluation System menerapkan keamanan secara berlapis dengan menggabungkan teknologi Web2 dan Web3.

AES-256 digunakan untuk menjaga kerahasiaan data sensitif.

SHA-256 memastikan integritas dokumen.

ECDSA melalui MetaMask memberikan autentikasi dan non-repudiation untuk transaksi blockchain.

Smart Contract menyediakan audit trail yang tidak dapat dimodifikasi.

Pendekatan ini menghasilkan sistem yang lebih aman, transparan, dan sesuai untuk implementasi pada lingkungan perusahaan yang memerlukan akuntabilitas tinggi.
