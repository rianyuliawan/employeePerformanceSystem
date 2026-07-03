# 18_UI_UX_GUIDELINE.md

# User Interface & User Experience Guideline

## Employee Performance Evaluation System

Version 1.0

---

# 1. Overview

Dokumen ini menjelaskan standar User Interface (UI) dan User Experience (UX) yang digunakan pada Employee Performance Evaluation System.

Tujuan utama adalah menciptakan antarmuka yang:

- Modern
- Clean
- Professional
- Responsive
- Accessible
- Easy to Use

---

# 2. Design Principles

Sistem mengikuti prinsip:

- Minimalism
- Consistency
- Simplicity
- Accessibility
- Responsive Design
- User-Centered Design

---

# 3. Design Style

Style yang digunakan

Modern SaaS Dashboard

Referensi

- Vercel
- Stripe
- Clerk
- Notion
- Linear

---

# 4. Color Palette

Primary

```
#2563EB
```

Blue

Secondary

```
#0F172A
```

Slate

Success

```
#22C55E
```

Warning

```
#F59E0B
```

Danger

```
#EF4444
```

Background

```
#F8FAFC
```

Card

```
#FFFFFF
```

Border

```
#E2E8F0
```

---

# 5. Typography

Font

Inter

Fallback

sans-serif

---

Heading

32 px

Bold

---

Sub Heading

24 px

Semi Bold

---

Body

16 px

Regular

---

Caption

14 px

Regular

---

# 6. Layout

Desktop

```
Sidebar

Header

Content

Footer
```

---

Mobile

```
Header

Drawer Menu

Content
```

---

# 7. Navigation

Sidebar

- Dashboard
- Employees
- Evaluation
- Promotion
- Blockchain
- Reports
- Audit Logs
- Settings

---

Top Navigation

- Search
- Notification
- Wallet Status
- User Profile

---

# 8. Authentication Pages

Login

Components

- Logo
- Email
- Password
- Login Button

Forgot Password

Future Feature

---

# 9. Dashboard

Dashboard menampilkan

Cards

- Total Employee
- Evaluation Today
- Pending Promotion
- Blockchain Sync Status

Charts

- Employee by Department
- Monthly Evaluation
- Promotion Trend

Recent Activity

- Latest Evaluation
- Blockchain Transaction

---

# 10. Employee Page

Features

- Employee Table
- Search
- Filter
- Pagination
- Detail Modal
- Edit Modal
- Delete Confirmation

---

# 11. Evaluation Page

Features

- Evaluation Form
- KPI Score Input
- Comment
- Upload PDF
- Submit Button

Status Badge

- Draft
- Submitted
- Reviewed
- Approved
- Promotion Recommended
- Promotion Approved

---

# 12. Promotion Page

Features

- Promotion Requests
- Approval Timeline
- Recommendation Detail
- Approve
- Reject

---

# 13. Blockchain Page

Menampilkan

- Smart Contract Address
- Transaction Hash
- Wallet Address
- Block Number
- Timestamp
- Status

Button

- View on Etherscan
- Retry Sync

---

# 14. Audit Log Page

Table

Columns

- User
- Activity
- Date
- IP Address
- Result

Filter

- User
- Date
- Activity

---

# 15. Report Page

Features

- Export PDF
- Export Excel
- Employee Report
- Promotion Report
- Blockchain Report

---

# 16. Components

Buttons

- Primary
- Secondary
- Outline
- Danger

Inputs

- Text
- Number
- Select
- Textarea
- File Upload

Feedback

- Toast
- Alert
- Modal
- Confirmation Dialog

---

# 17. Design System

Border Radius

12px

Shadow

Soft Shadow

Spacing

8px Grid System

Transition

200ms

Hover

Scale 1.02

---

# 18. Responsive Breakpoints

Mobile

<640px

Tablet

640–1024px

Desktop

>1024px

---

# 19. Accessibility

Mengikuti prinsip WCAG.

- Keyboard Navigation
- Focus Indicator
- Sufficient Color Contrast
- ARIA Label
- Screen Reader Support

---

# 20. Wallet Integration UI

Wallet Status

- Connected
- Disconnected

Wallet Information

- Address
- Network
- Balance

Button

Connect Wallet

Disconnect Wallet

---

# 21. Notification

Jenis

Success

Info

Warning

Error

Posisi

Top Right

Auto Close

5 Seconds

---

# 22. Empty State

Contoh

"No evaluation data available."

Disertai tombol

Create Evaluation

---

# 23. Loading State

Menggunakan

- Skeleton Loader
- Spinner

Tidak menggunakan loading text saja.

---

# 24. Error State

404

"Page Not Found"

500

"Internal Server Error"

Blockchain Error

"Transaction failed. Please retry."

---

# 25. User Journey

```
Login

↓

Dashboard

↓

Employee

↓

Create Evaluation

↓

Review

↓

Promotion

↓

Blockchain Verification

↓

Report
```

---

# 26. UI Security

Frontend tidak pernah:

- Menyimpan AES Key
- Menyimpan Private Key
- Melakukan AES Encryption
- Menyimpan JWT di Local Storage (disarankan HttpOnly Cookie)

---

# 27. UX Principles

Sistem dirancang agar:

- Maksimal 3 klik menuju fitur utama.
- Form sederhana dan mudah dipahami.
- Feedback diberikan setelah setiap aksi.
- Status blockchain terlihat jelas.
- Pengguna mengetahui proses sinkronisasi secara real-time.

---

# 28. Future Enhancements

- Dark Mode
- Multi Language
- Push Notification
- Mobile App
- Dashboard Analytics
- AI Performance Insights

---

# 29. Design Tools

Wireframe

Figma

Prototype

Figma

Icons

Lucide React

Charts

Recharts

Illustration

unDraw

---

# 30. Summary

Antarmuka Employee Performance Evaluation System dirancang menggunakan pendekatan Modern SaaS Dashboard dengan fokus pada kemudahan penggunaan, konsistensi, keamanan, dan transparansi.

Desain mendukung integrasi blockchain tanpa mengurangi pengalaman pengguna sehingga teknologi Web3 dapat digunakan secara natural dalam proses evaluasi karyawan.