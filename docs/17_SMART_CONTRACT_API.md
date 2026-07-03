# 17_SMART_CONTRACT_API.md

# Smart Contract API Documentation

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan seluruh fungsi (Functions), Event, Modifier, Enum, Struct, dan Workflow pada Smart Contract Employee Performance Evaluation System.

Smart Contract dikembangkan menggunakan:

- Solidity 0.8.x
- Ethereum
- Remix IDE

Library

- OpenZeppelin
- ethers.js

---

# 2. Smart Contract Information

Contract Name

EmployeePerformanceContract

Compiler

0.8.x

License

MIT

Network

Ethereum Sepolia

Wallet

MetaMask

---

# 3. Smart Contract Responsibilities

Smart Contract bertanggung jawab terhadap:

- Evaluation Lifecycle
- Promotion Lifecycle
- Audit Trail
- Event Logging
- Integrity Verification

Tidak bertanggung jawab terhadap:

- Authentication Login
- Database
- AES Encryption
- File Storage

---

# 4. Enum

## UserRole

```solidity
enum UserRole {
    None,
    Employee,
    Manager,
    HR,
    Director
}
```

---

## EvaluationStatus

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

---

# 5. Struct

## Evaluation

```solidity
struct Evaluation {

    string evaluationId;

    string employeeId;

    bytes32 documentHash;

    EvaluationStatus status;

    address createdBy;

    address updatedBy;

    uint256 createdAt;

    uint256 updatedAt;

}
```

---

## Promotion

```solidity
struct Promotion {

    string promotionId;

    string employeeId;

    bytes32 promotionHash;

    address approvedBy;

    uint256 timestamp;

}
```

---

# 6. Mapping

```solidity
mapping(string => Evaluation)

public evaluations;

mapping(address => UserRole)

public roles;
```

---

# 7. Modifiers

## onlyManager

```solidity
modifier onlyManager()
```

Digunakan pada:

- submitEvaluation()

- recommendPromotion()

---

## onlyHR

```solidity
modifier onlyHR()
```

Digunakan pada:

- reviewEvaluation()

- approveEvaluation()

---

## onlyDirector

```solidity
modifier onlyDirector()
```

Digunakan pada:

- approvePromotion()

---

## evaluationExists

Memastikan evaluation tersedia.

---

## validTransition

Memastikan perpindahan status valid.

---

# 8. Public Functions

## setUserRole()

Description

Memberikan role kepada wallet.

Parameter

```solidity
address wallet

UserRole role
```

Only

Admin

---

## submitEvaluation()

Description

Manager mengirim evaluasi.

Parameter

```solidity
string evaluationId

string employeeId

bytes32 documentHash
```

Status

Draft

↓

Submitted

---

## reviewEvaluation()

Description

HR melakukan review.

Status

Submitted

↓

Reviewed

---

## approveEvaluation()

Description

HR melakukan approval.

Status

Reviewed

↓

Approved

---

## recommendPromotion()

Description

Manager memberikan rekomendasi promosi.

Status

Approved

↓

PromotionRecommended

---

## approvePromotion()

Description

Director menyetujui promosi.

Status

PromotionRecommended

↓

PromotionApproved

---

## verifyDocument()

Description

Memverifikasi hash.

Return

```solidity
bool
```

---

## getEvaluation()

Return

```solidity
Evaluation
```

---

# 9. Events

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

# 10. State Transition

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

Transisi berikut tidak diperbolehkan.

Draft

↓

Approved

---

Reviewed

↓

Submitted

---

Promotion Approved

↓

Draft

---

# 11. Access Control Matrix

| Function | Employee | Manager | HR | Director |
|-----------|:-------:|:-------:|:--:|:--------:|
| submitEvaluation | ✖ | ✔ | ✖ | ✖ |
| reviewEvaluation | ✖ | ✖ | ✔ | ✖ |
| approveEvaluation | ✖ | ✖ | ✔ | ✖ |
| recommendPromotion | ✖ | ✔ | ✖ | ✖ |
| approvePromotion | ✖ | ✖ | ✖ | ✔ |
| verifyDocument | ✔ | ✔ | ✔ | ✔ |

---

# 12. Backend Integration

Workflow

```
Evaluation Service

↓

Hash Service

↓

ethers.js

↓

Smart Contract

↓

Transaction Receipt
```

---

# 13. Transaction Flow

```
MetaMask

↓

ECDSA Signature

↓

Ethereum

↓

Smart Contract

↓

Emit Event

↓

Transaction Hash
```

---

# 14. Gas Optimization

Strategi

- bytes32 untuk hash
- uint8 untuk enum
- address untuk wallet
- uint256 untuk timestamp

Tidak menyimpan:

- PDF
- Nama
- Email
- Komentar
- Data sensitif

---

# 15. Error Handling

Contoh Error

```solidity
require(
    roles[msg.sender] == UserRole.Manager,
    "Only Manager"
);
```

```solidity
require(
    evaluations[id].status == EvaluationStatus.Submitted,
    "Invalid Status"
);
```

---

# 16. ABI

Frontend menggunakan ABI hasil compile Remix.

```
EmployeePerformanceContract.json
```

ABI digunakan oleh:

ethers.js

untuk memanggil Smart Contract.

---

# 17. Example ethers.js

```typescript
await contract.submitEvaluation(
    evaluationId,
    employeeId,
    documentHash
);
```

Review

```typescript
await contract.reviewEvaluation(
    evaluationId
);
```

Approve

```typescript
await contract.approveEvaluation(
    evaluationId
);
```

---

# 18. Security

Menggunakan:

- ECDSA Signature
- Modifier Access Control
- Immutable Event
- State Validation

Private Key tetap berada di MetaMask.

---

# 19. Future Improvements

Pengembangan berikutnya:

- Multi Signature Approval
- Timelock Contract
- On-chain Role Management
- OpenZeppelin AccessControl
- OpenZeppelin Pausable
- OpenZeppelin ReentrancyGuard

---

# 20. Summary

Smart Contract API menyediakan antarmuka blockchain untuk mengelola lifecycle evaluasi karyawan, mencatat audit trail, memverifikasi integritas dokumen, dan mengontrol perubahan status melalui state machine.

Integrasi dilakukan menggunakan ethers.js dengan MetaMask sebagai penyedia tanda tangan digital (ECDSA). Smart Contract hanya menyimpan metadata penting seperti hash dokumen, status evaluasi, wallet address, dan timestamp sehingga biaya gas tetap rendah serta keamanan dan transparansi tetap terjaga.