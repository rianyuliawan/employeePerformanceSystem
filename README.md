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

- Password harus disimpan dengan bcrypt pada implementasi database penuh.
- Data sensitif menggunakan AES-256-GCM di backend.
- Hash dokumen/evaluasi menggunakan SHA-256 dan dicatat ke smart contract.
- Private key pengguna tidak disimpan di backend. Transaksi produksi harus ditandatangani melalui MetaMask di frontend.

