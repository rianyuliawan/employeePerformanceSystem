import { PrismaClient, Role, EvaluationStatus, BlockchainSyncStatus } from "@prisma/client";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── AES encrypt helper (same as aes.service.ts) ──────────────────────────────
const AES_KEY_RAW = process.env.AES_SECRET_KEY ?? "development-aes-secret-key-change-me";
const AES_KEY = crypto.createHash("sha256").update(AES_KEY_RAW).digest();

function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", AES_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function main() {
  console.log("🌱 Seeding database...");

  // ── Departments ─────────────────────────────────────────────────────────────
  const engineering = await prisma.department.upsert({
    where: { name: "Engineering" },
    update: {},
    create: { name: "Engineering" },
  });
  const hr = await prisma.department.upsert({
    where: { name: "Human Resources" },
    update: {},
    create: { name: "Human Resources" },
  });
  const management = await prisma.department.upsert({
    where: { name: "Management" },
    update: {},
    create: { name: "Management" },
  });
  const finance = await prisma.department.upsert({
    where: { name: "Finance & Accounting" },
    update: {},
    create: { name: "Finance & Accounting" },
  });
  const marketing = await prisma.department.upsert({
    where: { name: "Marketing & Sales" },
    update: {},
    create: { name: "Marketing & Sales" },
  });
  const operations = await prisma.department.upsert({
    where: { name: "Operations" },
    update: {},
    create: { name: "Operations" },
  });
  const legal = await prisma.department.upsert({
    where: { name: "Legal & Compliance" },
    update: {},
    create: { name: "Legal & Compliance" },
  });

  // ── Positions ────────────────────────────────────────────────────────────────
  // Existing IDs kept exactly as-is — they're already referenced by live data.
  const seniorDev = await prisma.position.upsert({
    where: { id: "pos-senior-dev" },
    update: {},
    create: { id: "pos-senior-dev", name: "Senior Developer", level: 3, departmentId: engineering.id },
  });
  const juniorDev = await prisma.position.upsert({
    where: { id: "pos-junior-dev" },
    update: {},
    create: { id: "pos-junior-dev", name: "Junior Developer", level: 1, departmentId: engineering.id },
  });
  const hrSpecialist = await prisma.position.upsert({
    where: { id: "pos-hr" },
    update: {},
    create: { id: "pos-hr", name: "HR Specialist", level: 2, departmentId: hr.id },
  });
  const managerPos = await prisma.position.upsert({
    where: { id: "pos-manager" },
    update: {},
    create: { id: "pos-manager", name: "Engineering Manager", level: 4, departmentId: engineering.id },
  });
  const directorPos = await prisma.position.upsert({
    where: { id: "pos-director" },
    update: {},
    create: { id: "pos-director", name: "Director", level: 5, departmentId: management.id },
  });

  // A few more rungs on the existing Engineering & HR ladders.
  await prisma.position.upsert({
    where: { id: "pos-swe" }, update: {},
    create: { id: "pos-swe", name: "Software Engineer", level: 2, departmentId: engineering.id },
  });
  await prisma.position.upsert({
    where: { id: "pos-eng-head" }, update: {},
    create: { id: "pos-eng-head", name: "Head of Engineering", level: 5, departmentId: engineering.id },
  });
  await prisma.position.upsert({
    where: { id: "pos-hr-staff" }, update: {},
    create: { id: "pos-hr-staff", name: "HR Staff", level: 1, departmentId: hr.id },
  });
  await prisma.position.upsert({
    where: { id: "pos-hr-sup" }, update: {},
    create: { id: "pos-hr-sup", name: "HR Supervisor", level: 3, departmentId: hr.id },
  });
  await prisma.position.upsert({
    where: { id: "pos-hr-mgr" }, update: {},
    create: { id: "pos-hr-mgr", name: "HR Manager", level: 4, departmentId: hr.id },
  });
  await prisma.position.upsert({
    where: { id: "pos-hr-head" }, update: {},
    create: { id: "pos-hr-head", name: "Head of HR", level: 5, departmentId: hr.id },
  });

  // Generic 6-level career ladder (Staff → Officer → Senior → Supervisor → Manager → Head)
  // for the newly added departments.
  const genericLadder = (slug: string, departmentId: string, titles: [string, string, string, string, string, string]) =>
    Promise.all(
      titles.map((name, i) =>
        prisma.position.upsert({
          where: { id: `pos-${slug}-${i + 1}` },
          update: {},
          create: { id: `pos-${slug}-${i + 1}`, name, level: i + 1, departmentId },
        })
      )
    );

  await genericLadder("fin", finance.id, [
    "Staff Finance", "Finance Officer", "Senior Accountant", "Finance Supervisor", "Finance Manager", "Head of Finance",
  ]);
  await genericLadder("mkt", marketing.id, [
    "Staff Marketing", "Marketing Officer", "Senior Marketing Specialist", "Marketing Supervisor", "Marketing Manager", "Head of Marketing",
  ]);
  await genericLadder("ops", operations.id, [
    "Staff Operations", "Operations Officer", "Senior Operations Specialist", "Operations Supervisor", "Operations Manager", "Head of Operations",
  ]);
  await genericLadder("legal", legal.id, [
    "Staff Legal", "Legal Officer", "Senior Legal Officer", "Legal Supervisor", "Legal Manager", "Head of Legal",
  ]);

  // ── Evaluation Period ────────────────────────────────────────────────────────
  const period2026 = await prisma.evaluationPeriod.upsert({
    where: { name: "Annual 2026" },
    update: {},
    create: {
      name: "Annual 2026",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      isActive: true,
    },
  });

  // ── Users ────────────────────────────────────────────────────────────────────
  const pw = await bcrypt.hash("password123", 10);

  // Director (Owner) — wallet sudah kamu punya
  const userDirector = await prisma.user.upsert({
    where: { email: "director@company.com" },
    update: { walletAddress: "0xbC1d083Ea440d0F7785b35566113b35F20A5E699" },
    create: {
      id: "user-director",
      name: "Rian (Director)",
      email: "director@company.com",
      passwordHash: pw,
      role: Role.Director,
      walletAddress: "0xbC1d083Ea440d0F7785b35566113b35F20A5E699",
    },
  });

  // HR
  const userHR = await prisma.user.upsert({
    where: { email: "hr@company.com" },
    update: {},
    create: {
      id: "user-hr",
      name: "Diana HR",
      email: "hr@company.com",
      passwordHash: pw,
      role: Role.HR,
      walletAddress: null, // akan diisi nanti
    },
  });

  // Manager
  const userManager = await prisma.user.upsert({
    where: { email: "manager@company.com" },
    update: {},
    create: {
      id: "user-manager",
      name: "Maya Manager",
      email: "manager@company.com",
      passwordHash: pw,
      role: Role.Manager,
      walletAddress: null,
    },
  });

  // Employee 1
  const userEmp1 = await prisma.user.upsert({
    where: { email: "john@company.com" },
    update: {},
    create: {
      id: "user-emp-001",
      name: "John Doe",
      email: "john@company.com",
      passwordHash: pw,
      role: Role.Employee,
      walletAddress: null,
    },
  });

  // Employee 2
  const userEmp2 = await prisma.user.upsert({
    where: { email: "siti@company.com" },
    update: {},
    create: {
      id: "user-emp-002",
      name: "Siti Nurhaliza",
      email: "siti@company.com",
      passwordHash: pw,
      role: Role.Employee,
      walletAddress: null,
    },
  });

  // ── HR as Employee record ────────────────────────────────────────────────────
  await prisma.employee.upsert({
    where: { userId: userHR.id },
    update: {},
    create: {
      id: "emp-hr-001",
      employeeCode: "EMP-HR-001",
      fullName: "Diana HR",
      phoneEncrypted: encrypt("081234567890"),
      addressEncrypted: encrypt("Jl. HR No. 1, Jakarta"),
      departmentId: hr.id,
      positionId: hrSpecialist.id,
      hireDate: new Date("2020-03-01"),
      userId: userHR.id,
    },
  });

  // Manager as Employee record
  await prisma.employee.upsert({
    where: { userId: userManager.id },
    update: {},
    create: {
      id: "emp-mgr-001",
      employeeCode: "EMP-MGR-001",
      fullName: "Maya Manager",
      phoneEncrypted: encrypt("081234567891"),
      addressEncrypted: encrypt("Jl. Manager No. 2, Jakarta"),
      departmentId: engineering.id,
      positionId: managerPos.id,
      hireDate: new Date("2019-06-01"),
      userId: userManager.id,
    },
  });

  // Employee 1
  await prisma.employee.upsert({
    where: { userId: userEmp1.id },
    update: {},
    create: {
      id: "emp-001",
      employeeCode: "EMP-001",
      fullName: "John Doe",
      phoneEncrypted: encrypt("081234567892"),
      addressEncrypted: encrypt("Jl. Sudirman No. 10, Jakarta"),
      departmentId: engineering.id,
      positionId: juniorDev.id,
      hireDate: new Date("2022-01-10"),
      userId: userEmp1.id,
    },
  });

  // Employee 2
  await prisma.employee.upsert({
    where: { userId: userEmp2.id },
    update: {},
    create: {
      id: "emp-002",
      employeeCode: "EMP-002",
      fullName: "Siti Nurhaliza",
      phoneEncrypted: encrypt("081234567893"),
      addressEncrypted: encrypt("Jl. Thamrin No. 5, Jakarta"),
      departmentId: engineering.id,
      positionId: seniorDev.id,
      hireDate: new Date("2021-04-15"),
      userId: userEmp2.id,
    },
  });

  // Director as Employee record
  await prisma.employee.upsert({
    where: { userId: userDirector.id },
    update: {},
    create: {
      id: "emp-dir-001",
      employeeCode: "EMP-DIR-001",
      fullName: "Rian (Director)",
      phoneEncrypted: encrypt("081234567894"),
      addressEncrypted: encrypt("Jl. Kuningan No. 1, Jakarta"),
      departmentId: management.id,
      positionId: directorPos.id,
      hireDate: new Date("2018-01-01"),
      userId: userDirector.id,
    },
  });

  // ── Sample Evaluation ────────────────────────────────────────────────────────
  const emp1 = await prisma.employee.findUnique({ where: { userId: userEmp1.id } });
  if (emp1) {
    const comment = "John menunjukkan performa yang konsisten dan dedikasi tinggi sepanjang tahun 2026.";
    const docContent = JSON.stringify({ employeeId: emp1.id, period: "Annual 2026", comment });
    const docHash = sha256(docContent);

    await prisma.evaluation.upsert({
      where: { id: "eval-sample-001" },
      update: {},
      create: {
        id: "eval-sample-001",
        employeeId: emp1.id,
        managerId: userManager.id,
        periodId: period2026.id,
        totalScore: 88.5,
        commentEncrypted: encrypt(comment),
        documentHash: docHash,
        status: EvaluationStatus.Submitted,
        blockchainStatus: BlockchainSyncStatus.Pending,
        details: {
          create: [
            { indicator: "Discipline",     score: 90, weight: 0.15 },
            { indicator: "Communication",  score: 85, weight: 0.15 },
            { indicator: "Leadership",     score: 80, weight: 0.15 },
            { indicator: "Teamwork",       score: 92, weight: 0.15 },
            { indicator: "Responsibility", score: 88, weight: 0.15 },
            { indicator: "Productivity",   score: 90, weight: 0.15 },
            { indicator: "Initiative",     score: 88, weight: 0.10 },
          ],
        },
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("\n📋 Demo Users:");
  console.log("  director@company.com / password123  → Role: Director (wallet: 0xbC1d...5E699)");
  console.log("  hr@company.com        / password123  → Role: HR");
  console.log("  manager@company.com   / password123  → Role: Manager");
  console.log("  john@company.com      / password123  → Role: Employee");
  console.log("  siti@company.com      / password123  → Role: Employee");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
