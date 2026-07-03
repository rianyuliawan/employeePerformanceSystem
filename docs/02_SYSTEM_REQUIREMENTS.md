# 02_SYSTEM_REQUIREMENTS.md

# System Requirements Specification (SRS)

## Employee Performance Evaluation System

Version: 1.0

---

# 1. Introduction

Dokumen ini mendefinisikan seluruh kebutuhan fungsional dan non-fungsional dari Employee Performance Evaluation System.

Dokumen ini menjadi acuan utama selama proses analisis, desain, implementasi, dan pengujian sistem.

---

# 2. System Actors

Sistem memiliki empat aktor utama.

## Human Resource (HR)

Tanggung jawab:

* Mengelola data karyawan
* Mengelola divisi
* Mengelola jabatan
* Melakukan approval promosi
* Melihat seluruh laporan

---

## Manager

Tanggung jawab:

* Memberikan penilaian
* Mengunggah dokumen evaluasi
* Memberikan rekomendasi promosi
* Melihat riwayat evaluasi tim

---

## Director

Tanggung jawab:

* Approval akhir promosi
* Approval bonus
* Melihat laporan perusahaan

---

## Employee

Tanggung jawab:

* Melihat hasil evaluasi pribadi
* Mengunduh laporan evaluasi

---

# 3. Functional Requirements

## Authentication

### FR-01

Sistem harus menyediakan login menggunakan Email dan Password.

---

### FR-02

Sistem harus mendukung login menggunakan MetaMask.

---

### FR-03

Sistem harus memverifikasi wallet Ethereum sebelum melakukan transaksi blockchain.

---

## Employee Management

### FR-04

HR dapat menambahkan data karyawan.

---

### FR-05

HR dapat mengubah data karyawan.

---

### FR-06

HR dapat menghapus data karyawan.

---

### FR-07

HR dapat melihat seluruh data karyawan.

---

### FR-08

Employee hanya dapat melihat data miliknya sendiri.

---

## Department

### FR-09

HR dapat membuat divisi baru.

---

### FR-10

HR dapat mengubah divisi.

---

### FR-11

HR dapat menghapus divisi.

---

## Position

### FR-12

HR dapat membuat jabatan baru.

---

### FR-13

HR dapat memperbarui jabatan.

---

### FR-14

HR dapat menghapus jabatan.

---

## Performance Evaluation

### FR-15

Manager dapat membuat evaluasi baru.

---

### FR-16

Manager dapat memberikan nilai KPI.

---

### FR-17

Manager dapat memberikan komentar evaluasi.

---

### FR-18

Manager dapat mengunggah dokumen evaluasi.

---

### FR-19

Manager dapat memberikan rekomendasi promosi.

---

### FR-20

HR dapat melihat seluruh hasil evaluasi.

---

### FR-21

Employee hanya dapat melihat hasil evaluasinya sendiri.

---

## Promotion

### FR-22

HR dapat melakukan approval promosi.

---

### FR-23

Director dapat melakukan approval akhir.

---

### FR-24

Sistem harus memperbarui status promosi.

---

### FR-25

Sistem harus menyimpan riwayat promosi.

---

## Smart Contract

### FR-26

Sistem harus mengirim hash dokumen evaluasi ke Smart Contract.

---

### FR-27

Sistem harus menyimpan skor akhir evaluasi ke blockchain.

---

### FR-28

Sistem harus menyimpan wallet evaluator.

---

### FR-29

Sistem harus menyimpan timestamp transaksi.

---

### FR-30

Sistem harus menghasilkan event blockchain untuk setiap transaksi penting.

---

## Cryptography

### FR-31

Sistem harus mengenkripsi data sensitif menggunakan AES-256 sebelum disimpan ke database.

---

### FR-32

Sistem harus mendekripsi data saat ditampilkan kepada pengguna yang memiliki hak akses.

---

### FR-33

Sistem harus menghasilkan hash SHA-256 dari dokumen evaluasi.

---

### FR-34

Hash SHA-256 harus dikirim ke Smart Contract.

---

## Dashboard

### FR-35

Dashboard menampilkan jumlah karyawan.

---

### FR-36

Dashboard menampilkan jumlah promosi.

---

### FR-37

Dashboard menampilkan grafik evaluasi.

---

### FR-38

Dashboard menampilkan aktivitas blockchain terbaru.

---

## Audit

### FR-39

Sistem harus menyimpan histori evaluasi.

---

### FR-40

Sistem harus menyediakan histori promosi.

---

# 4. Non Functional Requirements

## Security

### NFR-01

Seluruh komunikasi menggunakan HTTPS.

---

### NFR-02

Seluruh data sensitif dienkripsi menggunakan AES-256.

---

### NFR-03

Seluruh transaksi blockchain menggunakan digital signature Ethereum.

---

### NFR-04

Password disimpan menggunakan hashing yang aman (misalnya bcrypt atau Argon2), bukan AES.

---

### NFR-05

Hash dokumen menggunakan SHA-256.

---

## Performance

### NFR-06

Respon API maksimal 3 detik.

---

### NFR-07

Dashboard mampu menangani minimal 100 pengguna aktif secara bersamaan.

---

## Reliability

### NFR-08

Riwayat blockchain tidak boleh berubah setelah transaksi berhasil.

---

### NFR-09

Data database harus memiliki mekanisme backup.

---

## Availability

### NFR-10

Sistem tersedia minimal 99%.

---

## Scalability

### NFR-11

Database dapat diperluas tanpa memengaruhi Smart Contract.

---

# 5. System Constraints

Sistem menggunakan:

* Next.js
* Node.js
* PostgreSQL
* Solidity
* Remix IDE
* Ethereum Sepolia
* MetaMask

---

# 6. Business Rules

BR-01

Manager hanya dapat mengevaluasi karyawan dalam divisinya.

---

BR-02

Employee tidak dapat mengubah hasil evaluasi.

---

BR-03

HR hanya dapat melakukan promosi setelah evaluasi selesai.

---

BR-04

Setiap evaluasi memiliki satu manager sebagai evaluator utama.

---

BR-05

Setiap dokumen evaluasi harus memiliki hash SHA-256.

---

BR-06

Data sensitif wajib melalui proses enkripsi AES-256 sebelum disimpan.

---

BR-07

Smart Contract hanya menyimpan data yang diperlukan sebagai audit trail, bukan seluruh data karyawan.

---

# 7. Assumptions

* Seluruh pengguna memiliki akun sistem.
* Manager memiliki wallet Ethereum.
* HR memiliki wallet Ethereum.
* MetaMask telah terpasang.
* Koneksi internet tersedia saat mengakses blockchain publik.

---

# 8. Success Criteria

Project dianggap berhasil apabila:

* Seluruh fitur CRUD berjalan dengan baik.
* AES berhasil mengenkripsi dan mendekripsi data sensitif.
* SHA-256 menghasilkan hash yang konsisten.
* Smart Contract berhasil menyimpan hash dan data audit.
* Frontend berhasil terhubung ke MetaMask.
* Dashboard menampilkan data secara real-time.
* Sistem mampu melakukan verifikasi integritas dokumen menggunakan hash yang tersimpan di blockchain.
