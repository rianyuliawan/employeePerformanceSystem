# Employee Performance System (EPS)

Sistem penilaian kinerja & kenaikan pangkat karyawan berbasis **Hybrid Web2 + Web3**: data operasional (termasuk data pribadi karyawan) disimpan di database seperti aplikasi web pada umumnya, sementara **bukti integritas** dari setiap evaluasi kinerja dan surat keputusan kenaikan pangkat dicatat permanen di **blockchain** — sehingga bisa diverifikasi siapa saja dan tidak bisa diubah diam-diam tanpa ketahuan.

Dibangun untuk tugas mata kuliah Kriptografi, dengan penerapan nyata: **enkripsi simetris (AES-256-GCM)**, **hashing satu arah (SHA-256)**, **tanda tangan digital (ECDSA via MetaMask)**, dan **hashing password (bcrypt)**.

---

## Daftar Isi

1. [Ringkasan & Masalah yang Diselesaikan](#ringkasan--masalah-yang-diselesaikan)
2. [Tech Stack](#tech-stack)
3. [Struktur Proyek](#struktur-proyek)
4. [Role & Hak Akses](#role--hak-akses)
5. [Fitur-Fitur](#fitur-fitur)
6. [Alur Sistem](#alur-sistem)
7. [Kriptografi yang Digunakan](#kriptografi-yang-digunakan)
8. [Blockchain & Smart Contract](#blockchain--smart-contract)
9. [Instalasi & Menjalankan Lokal](#instalasi--menjalankan-lokal)
10. [Environment Variables](#environment-variables)
11. [Akun Demo](#akun-demo)
12. [Testing & CI](#testing--ci)
13. [Known Limitations](#known-limitations-belum-production-ready)

---

## Ringkasan & Masalah yang Diselesaikan

Penilaian kinerja karyawan secara manual (kertas/Excel/aplikasi HR biasa) punya masalah kepercayaan: siapa yang menjamin skor evaluasi atau surat keputusan (SK) kenaikan pangkat tidak diubah setelah disetujui? Sistem ini menjawabnya dengan:

- Menyimpan **hash kriptografis** (bukan data mentah) dari setiap evaluasi & SK kenaikan pangkat ke smart contract di blockchain publik (Sepolia testnet).
- Menyediakan fitur **verifikasi dokumen**: siapa pun bisa mengunggah ulang dokumen dan sistem akan memberi tahu apakah dokumen itu masih identik dengan yang aslinya, dengan membandingkan hash-nya ke database **dan** ke blockchain.
- Tetap menjaga privasi data karyawan (telepon, alamat, komentar evaluasi, alasan promosi) lewat **enkripsi**, bukan menaruhnya polos di database maupun di blockchain publik.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS, axios |
| Backend | Express.js (Node.js, TypeScript), Prisma ORM |
| Database | PostgreSQL (di-host di Supabase) |
| File Storage | Supabase Storage (fallback ke disk lokal saat development) |
| Blockchain | Solidity smart contract, jaringan Sepolia (Ethereum testnet), library `ethers.js` |
| Autentikasi | JWT (email/password) + tanda tangan wallet MetaMask (ECDSA) |
| Testing | Vitest (unit test) |
| CI | GitHub Actions (typecheck + test + build otomatis tiap push) |

## Struktur Proyek

```
employee-performance-system/
├── backend/                 Express REST API
│   ├── prisma/               schema.prisma & seed.ts
│   ├── src/
│   │   ├── controllers/      handler tiap endpoint
│   │   ├── services/         logic bisnis (evaluasi, promosi, kripto, storage, dll)
│   │   ├── routes/           definisi endpoint per resource
│   │   ├── middlewares/      auth JWT, role-check, error handler
│   │   ├── crypto/           AES-256-GCM & SHA-256
│   │   ├── blockchain/       koneksi ke smart contract via ethers.js
│   │   └── tests/            unit test (Vitest)
│   ├── api/                  entry point serverless (Vercel)
│   └── vercel.json
├── frontend/                 Next.js dashboard (HR, Manager, Director, Employee)
│   └── app/                  1 folder = 1 halaman (login, dashboard, employees, evaluations, promotions, settings, audit-logs, dll)
├── smart-contract/           Solidity contract (EmployeePerformanceAudit.sol) + ABI
├── database/                 dokumentasi schema & backup SQL
└── docs/                     dokumen requirement & desain (untuk laporan)
```

## Role & Hak Akses

Ada 4 role, masing-masing dengan hak akses berbeda:

| Role | Bisa Melakukan |
|---|---|
| **Employee** | Login, melihat evaluasi & promosi **miliknya sendiri saja** |
| **Manager** | Membuat evaluasi kinerja untuk karyawan, merekomendasikan promosi, mengajukan pengajuan promosi |
| **HR** | Me-review & approve evaluasi, mengelola data karyawan/departemen/wallet, reset password user |
| **Director** | Approve/reject pengajuan promosi (final decision) |

Setiap endpoint API dijaga oleh middleware role (`roleMiddleware`), dan data yang ditampilkan (list evaluasi/promosi) juga disaring sesuai kepemilikan — misalnya Employee cuma bisa melihat evaluasinya sendiri, bukan milik orang lain.

## Fitur-Fitur

### 1. Autentikasi (2 metode)
- **Email + Password** — password di-hash dengan **bcrypt**, sesi login pakai **JWT** (berlaku 8 jam).
- **MetaMask (Web3 Wallet)** — alur *"Sign-In with Ethereum"*: server memberi *nonce* (pesan acak sekali pakai), user tanda tangani dengan private key MetaMask, server verifikasi tanda tangan itu (**ECDSA**) cocok dengan wallet yang sudah didaftarkan oleh HR. Private key pengguna tidak pernah meninggalkan MetaMask.
- Ganti password sendiri (`Settings`) dan reset password oleh HR/Director untuk user lain yang lupa password (tanpa perlu email).

### 2. Manajemen Karyawan & Organisasi
- CRUD data karyawan oleh HR: kode karyawan, nama, telepon & alamat (**terenkripsi AES-256-GCM**), departemen, posisi/pangkat, tanggal masuk.
- **7 departemen**: Engineering, Human Resources, Management, Finance & Accounting, Marketing & Sales, Operations, Legal & Compliance.
- **±35 posisi/pangkat** membentuk tangga karier tiap departemen (level 1–6, contoh Engineering: Junior Developer → Software Engineer → Senior Developer → Engineering Manager → Head of Engineering).
- Assign wallet address ke akun user (dilakukan HR/Director) supaya user bisa login pakai MetaMask.

### 3. Evaluasi Kinerja (Performance Review)
- Manager menilai karyawan berdasarkan **7 indikator KPI berbobot**: Discipline, Communication, Leadership, Teamwork, Responsibility, Productivity, Initiative.
- Skor total dihitung otomatis (rata-rata tertimbang), komentar evaluasi **dienkripsi AES-256-GCM**.
- Alur status: `Submitted` → `Reviewed` (oleh HR) → `Approved` (oleh HR) → `PromotionRecommended` (oleh Manager, opsional) → `PromotionApproved` (setelah promosi disetujui Director).
- Setiap perubahan status memicu transaksi ke smart contract (lihat [Alur Sistem](#alur-sistem)).

### 4. Kenaikan Pangkat (Promosi) + Surat Keputusan Digital
- Manager/HR mengajukan promosi untuk karyawan yang evaluasinya sudah **Approved**/**PromotionRecommended** (divalidasi di backend, bukan cuma di tampilan).
- Saat **Director approve**, sistem otomatis:
  1. Men-generate **PDF Surat Keputusan Kenaikan Pangkat** resmi (nomor SK, identitas karyawan, jabatan lama→baru, dasar evaluasi, tanda tangan pengaju & penyetuju).
  2. Menghitung **SHA-256 dari file PDF itu sendiri** (bukan string sembarangan) — inilah "sidik jari" dokumennya.
  3. Menyimpan PDF ke **Supabase Storage** dan hash-nya ke database.
  4. Mengirim hash tersebut ke **smart contract** di Sepolia — tercatat permanen.
  5. Mengupdate posisi/jabatan karyawan di database.
- Siapa pun yang berkepentingan (karyawan bersangkutan, manager pengaju, atau HR/Director) bisa **mengunduh SK**-nya dari halaman Promosi.

### 5. Verifikasi Keaslian Dokumen (Tamper Detection)
- Fitur "Verifikasi Dokumen": unggah ulang file PDF SK, sistem hitung hash-nya lalu bandingkan **3 arah**:
  - Hash file yang diunggah vs hash di **database**
  - Hash file yang diunggah vs hash di **blockchain**
  - Kalau cocok semua → *"ASLI, belum pernah diubah"*. Kalau beda → *"TIDAK COCOK, kemungkinan telah diubah"* — bahkan mendeteksi kalau cuma 1 byte yang berubah.
  - Ini juga bisa mendeteksi skenario "orang dalam mengubah data langsung di database" — karena dibandingkan juga ke blockchain yang independen.

### 6. Dashboard
- Ringkasan real-time: total karyawan, total evaluasi, jumlah pending (tergantung role), dan 5 aktivitas blockchain terbaru lengkap dengan link ke Sepolia Etherscan.

### 7. Audit Log
- Setiap aksi penting (login, buat/review/approve evaluasi, buat/approve/reject promosi, assign wallet, reset password) tercatat di tabel `AuditLog`: siapa, aksi apa, dari IP mana, kapan. Bisa dilihat HR/Director di halaman **Audit Logs**.

## Alur Sistem

### Evaluasi Kinerja
```
Manager buat evaluasi (skor KPI + komentar terenkripsi)
        │  → hash data disimpan & dikirim ke blockchain (submitEvaluation)
        ▼
HR review evaluasi  →  HR approve evaluasi  →  Manager rekomendasikan promosi
        (tiap langkah = 1 transaksi ke smart contract)
```

### Kenaikan Pangkat
```
Evaluasi harus berstatus Approved / PromotionRecommended
        ▼
Manager/HR mengajukan promosi (pilih evaluasi + posisi target + alasan)
        ▼
Status: Pending
        ▼
Director approve ───────────────────────► Director reject
        │                                       │
   1. Generate PDF SK                      Status: Rejected
   2. Hash SHA-256 dari PDF itu sendiri
   3. Simpan PDF ke Supabase Storage
   4. Kirim hash ke blockchain (approvePromotion)
   5. Update posisi karyawan
        ▼
Siapa pun yang berkepentingan bisa unduh SK & memverifikasi keasliannya
```

## Kriptografi yang Digunakan

| Jenis | Algoritma | Dipakai untuk | Sifat |
|---|---|---|---|
| Enkripsi simetris | **AES-256-GCM** | Telepon, alamat, komentar evaluasi, alasan promosi | 2 arah (bisa didekripsi kembali) |
| Hash | **SHA-256** | `documentHash` evaluasi, `promotionHash` (dari PDF SK) | 1 arah (untuk bukti integritas, tidak bisa dibalik) |
| Tanda tangan digital | **ECDSA** (via MetaMask) | Login wallet — bukti kepemilikan private key | Signature, diverifikasi server tanpa private key dikirim |
| Hash password | **bcrypt** | Password akun email/password | 1 arah, khusus password (dengan salt) |

**Penting:** data pribadi karyawan (AES) dan bukti integritas dokumen (SHA-256 di blockchain) adalah dua hal yang terpisah — data asli **tidak pernah** dikirim ke blockchain, yang dikirim cuma hash-nya.

## Blockchain & Smart Contract

- Kontrak: `EmployeePerformanceAudit.sol`, jaringan **Sepolia testnet** — lihat `smart-contract/contracts/`.
- Fungsi utama: `submitEvaluation`, `reviewEvaluation`, `approveEvaluation`, `recommendPromotion`, `approvePromotion`, `verifyDocument`, `getEvaluation`, `getPromotion`.
- Modifier akses on-chain: `onlyManager`, `onlyHR`, `onlyDirector` (lihat [Known Limitations](#known-limitations-belum-production-ready) soal siapa yang benar-benar memegang wallet ini).
- Yang tersimpan **di blockchain**: ID evaluasi/promosi, hash (bukti), status, timestamp, alamat wallet pelaku.
- Yang tersimpan **di database** (dan TIDAK PERNAH ke blockchain): skor KPI, komentar, alasan promosi, data pribadi karyawan — semuanya di PostgreSQL (dengan bagian sensitif dienkripsi AES).
- Semua transaksi bisa dicek publik di [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x4318928514534c6f2C7a7e9262d82F4569c1E7Af).

## Instalasi & Menjalankan Lokal

```bash
git clone https://github.com/rianyuliawan/employeePerformanceSystem.git
cd employeePerformanceSystem
npm install

cp backend/.env.example backend/.env       # lalu isi nilai sebenarnya, lihat bagian Environment Variables
cp frontend/.env.example frontend/.env.local

npm run dev:backend    # http://localhost:5000/api/v1
npm run dev:frontend   # http://localhost:3000
```

> Proyek ini pakai **Supabase** (PostgreSQL terkelola) sebagai database, bukan Postgres lokal — jadi `DATABASE_URL` di `.env` harus diisi connection string dari project Supabase, bukan `docker-compose`. Untuk generate ulang Prisma Client / push schema, jalankan dari dalam folder `backend`: `npx prisma generate` dan `npx prisma db push`.

## Environment Variables

**`backend/.env`** (lihat `backend/.env.example`):

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL (Supabase) |
| `JWT_SECRET` | Secret untuk sign JWT — **wajib diisi di production**, gagal start kalau kosong |
| `AES_SECRET_KEY` | Kunci enkripsi AES-256 — **wajib diisi di production** |
| `RPC_URL` | RPC endpoint Sepolia (Alchemy/Infura) |
| `SMART_CONTRACT_ADDRESS` | Alamat smart contract yang sudah di-deploy |
| `DEPLOYER_PRIVATE_KEY` | Private key wallet yang menandatangani transaksi ke smart contract |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_STORAGE_BUCKET` | Untuk menyimpan PDF SK — kosongkan untuk fallback ke disk lokal (dev only) |

**`frontend/.env.local`** (lihat `frontend/.env.example`): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_CHAIN_ID`.

## Akun Demo

Semua akun demo pakai password **`password123`**.

| Email | Role | Catatan |
|---|---|---|
| `director@company.com` | Director | Punya wallet terdaftar (bisa login via MetaMask juga) |
| `hr@company.com` | HR | |
| `manager@company.com` | Manager | |
| `john@company.com`, `siti@company.com` | Employee | Engineering |
| `rafi@company.com`, `nabil@company.com`, `hafidz@company.com`, `zindu@company.com` | Employee | Engineering, punya wallet terdaftar |

Ditambah belasan akun Employee dummy di 4 departemen lain (Finance & Accounting, Marketing & Sales, Operations, Legal & Compliance) untuk mengisi struktur organisasi — total **22 karyawan di 7 departemen**. Lihat tabel `User` di database atau halaman **Settings → Manajemen Wallet** untuk daftar lengkap.

## Testing & CI

```bash
cd backend && npm test     # Vitest — unit test crypto, validasi schema, hashing blockchain
```

GitHub Actions (`.github/workflows/ci.yml`) otomatis menjalankan typecheck + test (backend) dan typecheck + build (frontend) setiap `push`/`pull request` ke `main`.

## Known Limitations (belum production-ready)

Proyek ini cocok untuk demo/skripsi, tapi ada beberapa keterbatasan arsitektur yang perlu diketahui sebelum dipakai serius:

1. **Satu wallet menandatangani semua transaksi blockchain.** Berbeda dengan login (yang memang pakai MetaMask tiap user), **semua transaksi tulis ke smart contract** (submit evaluasi, review, approve, promosi) ditandatangani oleh **satu wallet deployer** yang private key-nya disimpan di `backend/.env` (`DEPLOYER_PRIVATE_KEY`) — bukan wallet pribadi Manager/HR/Director yang login. Ini artinya:
   - Modifier `onlyManager`/`onlyHR`/`onlyDirector` di smart contract secara teknis semuanya dipegang oleh alamat wallet yang sama (milik sistem), bukan mencerminkan identitas wallet individual tiap role.
   - Kalau server bocor, private key ini bisa disalahgunakan untuk memanggil fungsi kritikal kontrak.
   - Desain yang lebih aman untuk produksi: tiap Manager/HR/Director punya wallet sendiri dan menandatangani transaksinya sendiri lewat MetaMask di frontend (mirip alur login wallet yang sudah ada) — ini perubahan arsitektur yang cukup besar dan sengaja belum dilakukan untuk menjaga kompleksitas proyek tetap sesuai kebutuhan skripsi/demo.
2. **Transaksi blockchain publik kadang gagal/revert di luar kendali aplikasi** (misal RPC node belum sinkron, jaringan padat) — saat ini tidak ada mekanisme retry otomatis, jadi kalau satu transaksi di tengah alur (review/approve/dst.) gagal, langkah berikutnya ikut gagal sampai transaksi itu diulang manual.
3. Reset password admin belum lewat email (langsung set password baru oleh HR/Director) — cukup untuk sistem internal, tidak cocok kalau butuh reset password mandiri via email.
4. Belum ada rate-limiting di endpoint login/API, belum ada monitoring/error-tracking (Sentry dkk).
