# 08_SMART_CONTRACT_DESIGN.md

# Smart Contract Design

## Employee Performance Evaluation System

Version 2.0

---

# 1. Overview

Smart Contract merupakan komponen Web3 yang berfungsi sebagai **Trusted Audit Layer** pada Employee Performance Evaluation System.

Smart Contract tidak digunakan sebagai database utama, melainkan sebagai media untuk:

- Audit Trail
- Evaluation Lifecycle Management
- Integrity Verification
- Immutable Event Logging

Pendekatan ini memungkinkan perusahaan tetap menggunakan PostgreSQL sebagai database operasional dengan biaya blockchain yang rendah.

---

# 2. Objectives

Smart Contract dirancang untuk memenuhi tujuan berikut:

- Menjamin integritas dokumen evaluasi.
- Menyimpan riwayat perubahan status evaluasi.
- Menyediakan audit trail permanen.
- Mengurangi risiko manipulasi data.
- Menyediakan transparansi terhadap proses evaluasi.

---

# 3. Responsibilities

Smart Contract bertanggung jawab terhadap:

✔ Evaluation Lifecycle

✔ Promotion Lifecycle

✔ Blockchain Event

✔ Document Hash

✔ Transaction Timestamp

✔ Wallet Verification

✔ Immutable History

Smart Contract **tidak** bertanggung jawab terhadap:

✖ Menyimpan PDF

✖ Menyimpan komentar evaluasi

✖ Menyimpan data pribadi

✖ Menyimpan password

✖ Menyimpan file

---

# 4. Smart Contract Architecture

```
                 Backend

                    │

            Blockchain Service

                    │

                ethers.js

                    │

               MetaMask Wallet

                    │

             ECDSA Signature

                    │

              Smart Contract

                    │

              Ethereum Network
```

---

# 5. Smart Contract Modules

Contract terdiri dari beberapa bagian.

```
Employee Evaluation

│

├── Evaluation Management

├── Promotion Management

├── Verification

├── Event Logging

└── Access Control
```

---

# 6. Evaluation Lifecycle

Setiap evaluasi memiliki status.

```
Draft

↓

Submitted

↓

Reviewed

↓

Approved

↓

Promotion Recommended

↓

Promotion Approved
```

Status tidak dapat kembali ke status sebelumnya.

---

# 7. Evaluation Status Enum

```solidity
enum EvaluationStatus {
    Draft,
    Submitted,
    Reviewed,
    Approved,
    PromotionRecommended,
    PromotionApproved
}
```

Status ini menjadi state machine utama pada Smart Contract.

---

# 8. Smart Contract Data Model

## Evaluation

| Field | Type |
|---------|------|
| evaluationId | string |
| employeeId | string |
| documentHash | bytes32 |
| status | uint8 |
| createdBy | address |
| updatedBy | address |
| timestamp | uint256 |

---

## Promotion

| Field | Type |
|---------|------|
| promotionId | string |
| employeeId | string |
| promotionHash | bytes32 |
| status | uint8 |
| approvedBy | address |
| timestamp | uint256 |

---

# 9. Smart Contract Functions

## submitEvaluation()

Manager mengirim evaluasi.

Input

- evaluationId
- employeeId
- documentHash

Output

Evaluation dibuat.

---

## reviewEvaluation()

HR melakukan review.

Output

Status berubah menjadi

Reviewed.

---

## approveEvaluation()

HR menyetujui evaluasi.

Output

Approved.

---

## recommendPromotion()

Manager memberikan rekomendasi promosi.

---

## approvePromotion()

Director melakukan approval promosi.

---

## verifyDocument()

Membandingkan hash.

Return

true

atau

false

---

## getEvaluation()

Mengambil metadata evaluasi.

---

## getPromotion()

Mengambil metadata promosi.

---

# 10. Access Control

Role dibatasi.

Manager

- submitEvaluation()
- recommendPromotion()

HR

- reviewEvaluation()
- approveEvaluation()

Director

- approvePromotion()

Semua user

- verifyDocument()

---

# 11. Event Design

Smart Contract menghasilkan event.

## EvaluationSubmitted

```solidity
event EvaluationSubmitted(
    string evaluationId,
    address manager,
    uint256 timestamp
);
```

---

## EvaluationReviewed

```solidity
event EvaluationReviewed(
    string evaluationId,
    address reviewer,
    uint256 timestamp
);
```

---

## EvaluationApproved

```solidity
event EvaluationApproved(
    string evaluationId,
    address approver,
    uint256 timestamp
);
```

---

## PromotionRecommended

```solidity
event PromotionRecommended(
    string evaluationId,
    address manager,
    uint256 timestamp
);
```

---

## PromotionApproved

```solidity
event PromotionApproved(
    string promotionId,
    address director,
    uint256 timestamp
);
```

---

## DocumentVerified

```solidity
event DocumentVerified(
    string evaluationId,
    bool valid,
    uint256 timestamp
);
```

---

# 12. Blockchain Workflow

```
Evaluation Saved

↓

SHA-256

↓

Blockchain Service

↓

MetaMask

↓

ECDSA Signature

↓

Smart Contract

↓

State Updated

↓

Emit Event

↓

Transaction Hash
```

---

# 13. State Machine

```
Draft

↓

Submitted

↓

Reviewed

↓

Approved

↓

Promotion Recommended

↓

Promotion Approved
```

Transition hanya boleh maju.

Tidak dapat mundur.

---

# 14. Blockchain Storage

Yang disimpan:

- Evaluation ID
- Employee ID
- Hash
- Status
- Wallet Address
- Timestamp

Yang tidak disimpan:

- Nama
- Email
- Nomor HP
- Alamat
- Komentar
- PDF

---

# 15. Gas Optimization

Strategi:

- bytes32 untuk hash
- uint8 untuk status
- address untuk wallet
- uint256 untuk timestamp

Tidak menyimpan string panjang.

---

# 16. Integration Flow

```
Evaluation Service

↓

Repository

↓

Database

↓

Hash Service

↓

Blockchain Service

↓

Smart Contract
```

---

# 17. Failure Recovery

Jika blockchain gagal.

```
Evaluation Saved

↓

Pending Blockchain Sync

↓

Retry Queue

↓

Blockchain Success

↓

Update Transaction Hash
```

---

# 18. Security

Smart Contract menggunakan:

- ECDSA
- Immutable Ledger
- Role Validation
- Transaction Verification

Private key tetap berada di MetaMask.

---

# 19. Design Decisions

| Decision | Reason |
|----------|--------|
| Smart Contract bukan database | Mengurangi gas fee |
| Hash disimpan on-chain | Menjamin integritas dokumen |
| State Machine | Mengelola lifecycle evaluasi |
| Event Logging | Audit trail permanen |
| Role-Based Function | Mencegah akses tidak sah |
| Hybrid Architecture | Menggabungkan efisiensi Web2 dan transparansi Web3 |

---

# 20. Smart Contract Summary

Smart Contract pada sistem ini berfungsi sebagai **Trusted Audit Layer** yang mengelola lifecycle evaluasi, mencatat setiap perubahan status, menyimpan hash dokumen, dan menghasilkan audit trail yang tidak dapat dimodifikasi.

Dengan pendekatan ini, blockchain tidak menggantikan database, tetapi melengkapinya melalui pencatatan transaksi yang transparan, aman, dan dapat diverifikasi.