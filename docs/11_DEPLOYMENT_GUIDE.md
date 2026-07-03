# 11_DEPLOYMENT_GUIDE.md

# Deployment Guide

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan proses deployment seluruh komponen sistem Employee Performance Evaluation System.

Deployment dilakukan menggunakan pendekatan Hybrid Architecture yang terdiri dari:

* Frontend
* Backend
* Database
* Smart Contract
* Blockchain

---

# 2. Deployment Architecture

```text
                   User
                     │
                     ▼
             Frontend (Vercel)
                     │
             HTTPS REST API
                     │
                     ▼
         Backend (Node.js / Express)
             (Railway / Render)
              ┌──────────┴──────────┐
              ▼                     ▼
      PostgreSQL Database     Ethereum Sepolia
              │                     ▲
              │                     │
         AES-256 Encryption     Smart Contract
                                (Remix IDE)
```

---

# 3. Deployment Components

## Frontend

Platform

Vercel

Technology

* Next.js
* React
* Tailwind CSS

---

## Backend

Platform

Railway

atau

Render

Technology

* Node.js
* Express.js

---

## Database

Platform

PostgreSQL

Deployment

Railway PostgreSQL

atau

Supabase PostgreSQL

---

## Smart Contract

IDE

Remix IDE

Network

Ethereum Sepolia

Wallet

MetaMask

---

# 4. Smart Contract Deployment

## Step 1

Buka Remix IDE

---

## Step 2

Compile Smart Contract

Compiler

0.8.x

---

## Step 3

Hubungkan MetaMask

Environment

Injected Provider - MetaMask

---

## Step 4

Pilih Network

Ethereum Sepolia

---

## Step 5

Deploy Contract

Hasil deployment akan menghasilkan:

* Contract Address
* Transaction Hash

---

## Step 6

Simpan informasi berikut.

```text
Contract Address

ABI

Transaction Hash

Network
```

---

# 5. Backend Configuration

Backend membutuhkan Environment Variable.

```env
PORT=

DATABASE_URL=

JWT_SECRET=

AES_SECRET_KEY=

RPC_URL=

PRIVATE_KEY=

SMART_CONTRACT_ADDRESS=
```

---

# 6. Frontend Configuration

Frontend menggunakan Environment Variable.

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_CONTRACT_ADDRESS=

NEXT_PUBLIC_CHAIN_ID=

NEXT_PUBLIC_RPC_URL=
```

---

# 7. MetaMask Configuration

Network

Ethereum Sepolia

Wallet

MetaMask

Gunakan wallet yang sama saat deploy Smart Contract.

---

# 8. Database Deployment

Deploy PostgreSQL.

Import seluruh schema database.

Lakukan migration.

Verifikasi koneksi backend.

---

# 9. Backend Deployment

Deploy ke Railway.

Verifikasi:

* Database Connection
* AES Encryption
* API Endpoint
* Smart Contract Connection

---

# 10. Frontend Deployment

Deploy ke Vercel.

Verifikasi:

* Login
* Dashboard
* API
* MetaMask
* Blockchain

---

# 11. Deployment Flow

```text
Develop

↓

Local Testing

↓

Deploy Smart Contract

↓

Deploy Database

↓

Deploy Backend

↓

Deploy Frontend

↓

Production
```

---

# 12. Testing Checklist

Frontend

✔ Login

✔ Dashboard

✔ Employee CRUD

✔ Evaluation

✔ Promotion

---

Backend

✔ API

✔ AES

✔ JWT

✔ Database

---

Blockchain

✔ MetaMask

✔ Smart Contract

✔ Transaction

✔ Event

---

# 13. Production Checklist

Database

✔ Backup

Backend

✔ HTTPS

Frontend

✔ HTTPS

Smart Contract

✔ Verified

Wallet

✔ Connected

---

# 14. Security Checklist

AES Key

Tidak boleh disimpan di Frontend.

---

Private Key

Tidak boleh diupload ke GitHub.

---

Database

Gunakan SSL.

---

HTTPS

Wajib aktif.

---

MetaMask

Selalu melakukan konfirmasi transaksi.

---

# 15. Deployment Verification

Verifikasi berikut harus berhasil.

* Login
* Create Employee
* Create Evaluation
* AES Encryption
* SHA-256 Hash
* Smart Contract Transaction
* Blockchain Event
* Dashboard

---

# 16. Deployment Summary

Deployment akhir menggunakan arsitektur berikut.

Frontend

↓

Vercel

↓

Backend

↓

Railway / Render

↓

PostgreSQL

↓

Ethereum Sepolia

↓

Smart Contract

Dengan arsitektur ini, sistem dapat berjalan secara end-to-end mulai dari antarmuka pengguna hingga pencatatan audit trail pada blockchain.
