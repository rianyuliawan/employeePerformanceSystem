# 09_CRYPTOGRAPHY.md

# Cryptography Design

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan implementasi kriptografi yang digunakan pada Employee Performance Evaluation System.

Sistem menerapkan beberapa mekanisme kriptografi yang memiliki fungsi berbeda sehingga mampu memberikan Confidentiality, Integrity, Authentication, dan Non-Repudiation.

Implementasi kriptografi terdiri dari:

* AES-256
* SHA-256
* ECDSA (Ethereum Digital Signature)

---

# 2. Cryptography Architecture

```text
                User
                  │
                  ▼
          Input Evaluation
                  │
          ┌───────┴────────┐
          ▼                ▼
      AES-256          SHA-256
          │                │
          ▼                ▼
     PostgreSQL      Smart Contract
                           │
                           ▼
                      Ethereum
```

---

# 3. AES-256

## Purpose

AES digunakan untuk menjaga kerahasiaan (Confidentiality).

Seluruh data sensitif akan dienkripsi sebelum disimpan ke database.

---

## AES Algorithm

Advanced Encryption Standard

Key Length

* 128-bit
* 192-bit
* **256-bit (digunakan pada sistem ini)**

Mode yang direkomendasikan:

AES-256-GCM

Alasan:

* Authentication Tag
* Confidentiality
* Integrity Protection

---

# 4. AES Implementation

## Data yang Dienkripsi

Employee

* Phone Number
* Address

Evaluation

* Evaluation Comment
* Evaluation Report

Promotion

* Promotion Reason

---

## Encryption Flow

```text
Plaintext

↓

AES-256 Encrypt

↓

Ciphertext

↓

PostgreSQL
```

---

## Decryption Flow

```text
Ciphertext

↓

AES-256 Decrypt

↓

Plaintext

↓

Frontend
```

---

# 5. Encryption Example

Input

```text
"Karyawan menunjukkan performa yang sangat baik."
```

AES Encrypt

↓

Ciphertext

```text
c81fa9287be2fd3...
```

Database hanya menyimpan ciphertext.

---

# 6. SHA-256

## Purpose

SHA-256 digunakan untuk memastikan integritas data.

---

## Data yang di-Hash

Evaluation Report

Promotion Document

---

## Hash Flow

```text
Document

↓

SHA-256

↓

Hash

↓

Blockchain
```

---

## Verification Flow

Ketika auditor ingin memverifikasi dokumen.

```text
Database

↓

AES Decrypt

↓

Generate SHA-256

↓

Compare

↓

Blockchain Hash
```

Jika hash sama

↓

Dokumen asli.

Jika hash berbeda

↓

Dokumen telah dimodifikasi.

---

# 7. SHA-256 Example

Document

```text
Evaluation.pdf
```

↓

Hash

```text
A93F0D12B2D8...
```

Hash tersebut disimpan pada Smart Contract.

---

# 8. ECDSA

Ethereum menggunakan algoritma:

Elliptic Curve Digital Signature Algorithm.

---

## Fungsi

* Authentication
* Digital Signature
* Non Repudiation

---

## Workflow

```text
Manager

↓

MetaMask

↓

Sign Transaction

↓

ECDSA Signature

↓

Ethereum

↓

Smart Contract
```

---

# 9. Confidentiality

Diperoleh melalui:

AES-256

---

# 10. Integrity

Diperoleh melalui:

SHA-256

---

# 11. Authentication

Diperoleh melalui:

ECDSA

---

# 12. Non Repudiation

Diperoleh melalui:

ECDSA Signature

Karena transaksi ditandatangani wallet pengguna.

---

# 13. Key Management

AES Key

Disimpan pada Backend Server.

Tidak disimpan:

* Database
* Frontend
* Smart Contract

Disarankan menggunakan:

Environment Variable

```text
AES_SECRET_KEY
```

---

# 14. Blockchain Cryptography

Blockchain tidak melakukan proses:

* Encrypt
* Decrypt

Blockchain hanya menyimpan:

* Hash
* Wallet Address
* Timestamp
* Transaction

---

# 15. Security Flow

```text
Manager

↓

Input Evaluation

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

# 16. Why Hybrid Cryptography?

Satu algoritma tidak mampu memenuhi seluruh kebutuhan sistem.

Oleh karena itu digunakan kombinasi:

AES

↓

Confidentiality

SHA-256

↓

Integrity

ECDSA

↓

Authentication

Smart Contract

↓

Audit Trail

---

# 17. Cryptography Comparison

| Algorithm | Function                |
| --------- | ----------------------- |
| AES-256   | Encryption & Decryption |
| SHA-256   | Hashing                 |
| ECDSA     | Digital Signature       |

---

# 18. Security Principles

## Confidentiality

AES-256

---

## Integrity

SHA-256

---

## Authentication

ECDSA

---

## Non Repudiation

ECDSA

---

## Transparency

Blockchain

---

## Auditability

Smart Contract

---

# 19. Security Advantages

Implementasi kriptografi memberikan manfaat:

* Data sensitif tidak dapat dibaca langsung dari database.
* Dokumen dapat diverifikasi keasliannya.
* Setiap transaksi memiliki tanda tangan digital.
* Riwayat transaksi tidak dapat dimanipulasi.
* Audit menjadi lebih mudah.

---

# 20. Cryptography Summary

Sistem menggunakan pendekatan Hybrid Cryptography.

Data sensitif dilindungi menggunakan AES-256.

Integritas dokumen dijaga menggunakan SHA-256.

Setiap transaksi blockchain ditandatangani menggunakan ECDSA melalui MetaMask.

Kombinasi ketiga algoritma tersebut menghasilkan sistem yang mampu memenuhi aspek:

* Confidentiality
* Integrity
* Authentication
* Non-Repudiation

tanpa harus menyimpan data sensitif secara langsung pada blockchain.
