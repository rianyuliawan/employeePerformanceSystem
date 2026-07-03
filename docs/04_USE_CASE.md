# 04_USE_CASE.md

# Employee Performance Evaluation System

Version: 1.0

---

# 1. Overview

Dokumen ini menjelaskan seluruh interaksi antara aktor dan sistem Employee Performance Evaluation System.

Use Case digunakan sebagai dasar dalam pembuatan:

* Use Case Diagram
* Activity Diagram
* Sequence Diagram
* Database Design
* API Design
* Smart Contract Design

---

# 2. System Actors

Sistem memiliki empat aktor utama.

## Human Resource (HR)

Tanggung jawab:

* Mengelola data karyawan
* Mengelola divisi
* Mengelola jabatan
* Melihat seluruh evaluasi
* Approval promosi

---

## Manager

Tanggung jawab:

* Memberikan evaluasi
* Mengunggah dokumen evaluasi
* Memberikan rekomendasi promosi

---

## Director

Tanggung jawab:

* Approval akhir promosi
* Melihat laporan

---

## Employee

Tanggung jawab:

* Melihat hasil evaluasi
* Mengunduh laporan evaluasi

---

# 3. Use Case List

| UC    | Use Case                   | Actor                           |
| ----- | -------------------------- | ------------------------------- |
| UC-01 | Login                      | HR, Manager, Director, Employee |
| UC-02 | Connect MetaMask           | HR, Manager, Director           |
| UC-03 | Manage Employee            | HR                              |
| UC-04 | Manage Department          | HR                              |
| UC-05 | Manage Position            | HR                              |
| UC-06 | View Employee              | HR                              |
| UC-07 | Create Evaluation          | Manager                         |
| UC-08 | Upload Evaluation Document | Manager                         |
| UC-09 | View Evaluation            | HR, Manager, Employee           |
| UC-10 | Approve Evaluation         | HR                              |
| UC-11 | Recommend Promotion        | Manager                         |
| UC-12 | Approve Promotion          | Director                        |
| UC-13 | Verify Document Integrity  | HR, Director                    |
| UC-14 | View Blockchain History    | HR, Director                    |
| UC-15 | View Dashboard             | Semua Aktor                     |

---

# 4. Use Case Description

## UC-01 Login

### Actor

* HR
* Manager
* Director
* Employee

### Description

Pengguna melakukan autentikasi menggunakan email dan password.

### Preconditions

* Akun telah terdaftar.

### Main Flow

1. User membuka halaman login.
2. User memasukkan email.
3. User memasukkan password.
4. Sistem memverifikasi akun.
5. Dashboard ditampilkan.

### Postconditions

User berhasil login.

---

## UC-02 Connect MetaMask

### Actor

* HR
* Manager
* Director

### Description

Menghubungkan wallet Ethereum untuk melakukan transaksi blockchain.

### Main Flow

1. User klik Connect Wallet.
2. MetaMask terbuka.
3. User memilih wallet.
4. Wallet berhasil terhubung.

### Postconditions

Wallet siap digunakan untuk transaksi Smart Contract.

---

## UC-03 Manage Employee

### Actor

HR

### Description

HR mengelola data karyawan.

### Includes

* Create Employee
* Update Employee
* Delete Employee
* View Employee

---

## UC-04 Manage Department

### Actor

HR

### Description

HR mengelola data divisi perusahaan.

---

## UC-05 Manage Position

### Actor

HR

### Description

HR mengelola data jabatan.

---

## UC-06 View Employee

### Actor

HR

### Description

Melihat informasi seluruh karyawan.

---

## UC-07 Create Evaluation

### Actor

Manager

### Description

Manager melakukan penilaian terhadap karyawan.

### Main Flow

1. Pilih karyawan.
2. Isi KPI.
3. Isi komentar.
4. Upload dokumen.
5. Submit.

Backend:

* AES Encrypt
* Save Database
* Generate SHA-256
* Send Hash ke Smart Contract

---

## UC-08 Upload Evaluation Document

### Actor

Manager

### Description

Manager mengunggah dokumen evaluasi.

Dokumen akan:

* Dienkripsi AES-256.
* Disimpan ke database.
* Dibuat hash SHA-256.

---

## UC-09 View Evaluation

### Actor

HR

Manager

Employee

### Description

Menampilkan hasil evaluasi.

Hak akses:

Employee hanya dapat melihat evaluasi miliknya sendiri.

---

## UC-10 Approve Evaluation

### Actor

HR

### Description

HR memverifikasi hasil evaluasi.

Jika disetujui:

* Database diperbarui.
* Smart Contract menerima hash approval.

---

## UC-11 Recommend Promotion

### Actor

Manager

### Description

Manager memberikan rekomendasi promosi berdasarkan hasil evaluasi.

---

## UC-12 Approve Promotion

### Actor

Director

### Description

Director melakukan approval promosi.

Jika disetujui:

* Database diperbarui.
* Blockchain mencatat approval.

---

## UC-13 Verify Document Integrity

### Actor

HR

Director

### Description

Melakukan verifikasi keaslian dokumen.

Workflow:

1. Ambil dokumen.
2. AES Decrypt.
3. Generate SHA-256.
4. Bandingkan dengan hash di blockchain.

Jika sama:

Dokumen valid.

---

## UC-14 View Blockchain History

### Actor

HR

Director

### Description

Melihat histori transaksi blockchain.

---

## UC-15 View Dashboard

### Actor

Semua User

### Description

Menampilkan statistik sistem.

---

# 5. Include Relationships

UC-07 Create Evaluation

includes

* AES Encryption
* SHA-256 Generation
* Database Save

---

UC-10 Approve Evaluation

includes

* Smart Contract Transaction

---

UC-12 Approve Promotion

includes

* Smart Contract Transaction

---

UC-13 Verify Document

includes

* AES Decryption
* SHA-256 Verification

---

# 6. Extend Relationships

UC-07

extends

UC-08 Upload Evaluation Document

---

UC-11

extends

UC-10 Approve Evaluation

---

UC-12

extends

UC-11 Recommend Promotion

---

# 7. Access Matrix

| Feature            |    HR    |     Manager    |    Director    | Employee |
| ------------------ | :------: | :------------: | :------------: | :------: |
| Login              |     ✔    |        ✔       |        ✔       |     ✔    |
| Connect MetaMask   |     ✔    |        ✔       |        ✔       |     ✖    |
| Employee CRUD      |     ✔    |        ✖       |        ✖       |     ✖    |
| Department         |     ✔    |        ✖       |        ✖       |     ✖    |
| Position           |     ✔    |        ✖       |        ✖       |     ✖    |
| Evaluation         |   View   |     Create     |      View      | View Own |
| Promotion          | Approval | Recommendation | Final Approval |     ✖    |
| Dashboard          |     ✔    |        ✔       |        ✔       |     ✔    |
| Blockchain History |     ✔    |        ✖       |        ✔       |     ✖    |

---

# 8. System Boundary

Di dalam sistem:

* Authentication
* Employee Management
* Evaluation
* Promotion
* Cryptography
* Smart Contract Integration
* Dashboard

Di luar sistem:

* Ethereum Network
* MetaMask
* PostgreSQL
* Browser

---

# 9. Use Case Summary

Total Actor:

* 4

Total Use Case:

* 15

Fitur Utama:

* Employee Management
* Performance Evaluation
* Promotion Management
* Blockchain Audit Trail
* AES Encryption
* Document Integrity Verification
