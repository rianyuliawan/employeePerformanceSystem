# Employee Performance Evaluation System

Sistem penilaian kinerja karyawan berbasis Hybrid Web3 Architecture.

Komponen utama:

- `frontend`: Next.js dashboard untuk HR, Manager, Director, dan Employee.
- `backend`: Express.js REST API dengan JWT, RBAC, AES-256-GCM, SHA-256, dan Prisma.
- `database`: SQL schema PostgreSQL dan seed awal.
- `smart-contract`: Solidity contract untuk audit trail evaluasi dan promosi.
- `docs`: salinan dokumen kebutuhan dan desain dari folder `read`.

## Quick Start

```bash
cd employee-performance-system
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up -d postgres
npm run dev:backend
npm run dev:frontend
```

Backend berjalan di `http://localhost:5000/api/v1`.
Frontend berjalan di `http://localhost:3000`.

## Akun Demo

Backend menyediakan login demo tanpa database untuk pengujian awal:

- `hr@company.com` / `password123`
- `manager@company.com` / `password123`
- `director@company.com` / `password123`
- `employee@company.com` / `password123`

## Security Notes

- Password disimpan dengan bcrypt.
- Data sensitif (telepon, alamat, komentar evaluasi, alasan promosi) dienkripsi AES-256-GCM di backend.
- Hash dokumen/evaluasi/SK menggunakan SHA-256 dan dicatat ke smart contract di Sepolia testnet.
- Login wallet (MetaMask) memverifikasi kepemilikan wallet lewat tanda tangan ECDSA — private key pengguna tidak pernah meninggalkan MetaMask untuk proses **login**.

## Known Limitations (belum production-ready)

Proyek ini cocok untuk demo/skripsi, tapi ada beberapa keterbatasan arsitektur yang perlu diketahui sebelum dipakai serius:

1. **Satu wallet menandatangani semua transaksi blockchain.** Berbeda dengan login (yang memang pakai MetaMask tiap user), **semua transaksi tulis ke smart contract** (submit evaluasi, review, approve, promosi) ditandatangani oleh **satu wallet deployer** yang private key-nya disimpan di `backend/.env` (`DEPLOYER_PRIVATE_KEY`) — bukan wallet pribadi Manager/HR/Director yang login. Ini artinya:
   - Modifier `onlyManager`/`onlyHR`/`onlyDirector` di smart contract secara teknis semuanya dipegang oleh alamat wallet yang sama (milik sistem), bukan mencerminkan identitas wallet individual tiap role.
   - Kalau server bocor, private key ini bisa disalahgunakan untuk memanggil fungsi kritikal kontrak.
   - Desain yang lebih aman untuk produksi: tiap Manager/HR/Director punya wallet sendiri dan menandatangani transaksinya sendiri lewat MetaMask di frontend (mirip alur login wallet yang sudah ada) — ini perubahan arsitektur yang cukup besar dan sengaja belum dilakukan untuk menjaga kompleksitas proyek tetap sesuai kebutuhan skripsi/demo.
2. Beberapa hal lain yang juga masih jadi catatan: penyimpanan file PDF SK di disk lokal server (bukan cloud storage), belum ada automated test/CI penuh, dan reset password admin belum lewat email (langsung set password baru oleh HR/Director).

