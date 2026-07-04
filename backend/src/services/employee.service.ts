import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma.js";
import { encrypt, decrypt } from "../crypto/aes.service.js";

export async function listEmployees() {
  const employees = await prisma.employee.findMany({
    where: { isActive: true },
    include: {
      department: true,
      position: true,
      user: { select: { id: true, name: true, email: true, role: true, walletAddress: true, isActive: true } },
    },
    orderBy: { employeeCode: "asc" },
  });

  return employees.map((e) => ({
    id: e.id,
    employeeCode: e.employeeCode,
    fullName: e.fullName,
    phone: e.phoneEncrypted ? tryDecrypt(e.phoneEncrypted) : "",
    address: e.addressEncrypted ? tryDecrypt(e.addressEncrypted) : "",
    department: e.department.name,
    departmentId: e.departmentId,
    position: e.position.name,
    positionId: e.positionId,
    positionLevel: e.position.level,
    hireDate: e.hireDate.toISOString().slice(0, 10),
    isActive: e.isActive,
    user: e.user,
  }));
}

export async function getEmployee(id: string) {
  const e = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      position: true,
      user: { select: { id: true, name: true, email: true, role: true, walletAddress: true } },
    },
  });
  if (!e) return null;
  return {
    id: e.id,
    employeeCode: e.employeeCode,
    fullName: e.fullName,
    phone: e.phoneEncrypted ? tryDecrypt(e.phoneEncrypted) : "",
    address: e.addressEncrypted ? tryDecrypt(e.addressEncrypted) : "",
    department: e.department.name,
    departmentId: e.departmentId,
    position: e.position.name,
    positionId: e.positionId,
    hireDate: e.hireDate.toISOString().slice(0, 10),
    isActive: e.isActive,
    user: e.user,
  };
}

export async function createEmployee(data: {
  employeeCode: string;
  fullName: string;
  phone: string;
  address: string;
  departmentId: string;
  positionId: string;
  hireDate: string;
  // user account fields
  email: string;
  password: string;
  role?: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Create user first
  const user = await prisma.user.create({
    data: {
      name: data.fullName,
      email: data.email,
      passwordHash,
      role: (data.role as "HR" | "Manager" | "Director" | "Employee") ?? "Employee",
    },
  });

  const employee = await prisma.employee.create({
    data: {
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      phoneEncrypted: encrypt(data.phone),
      addressEncrypted: encrypt(data.address),
      departmentId: data.departmentId,
      positionId: data.positionId,
      hireDate: new Date(data.hireDate),
      userId: user.id,
    },
    include: { department: true, position: true, user: true },
  });

  return { ...employee, phone: data.phone, address: data.address };
}

export async function updateEmployee(id: string, data: {
  fullName?: string;
  phone?: string;
  address?: string;
  departmentId?: string;
  positionId?: string;
}) {
  const updateData: Record<string, unknown> = {};
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.phone) updateData.phoneEncrypted = encrypt(data.phone);
  if (data.address) updateData.addressEncrypted = encrypt(data.address);
  if (data.departmentId) updateData.departmentId = data.departmentId;
  if (data.positionId) updateData.positionId = data.positionId;

  return prisma.employee.update({
    where: { id },
    data: updateData,
    include: { department: true, position: true, user: true },
  });
}

export async function deleteEmployee(id: string) {
  await prisma.employee.update({ where: { id }, data: { isActive: false } });
  return true;
}

export async function assignWalletToUser(userId: string, walletAddress: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { walletAddress },
  });
}

// Evaluation/Promotion records key off Employee.id, not User.id — this
// resolves the Employee record linked to a logged-in user's account.
export async function getEmployeeIdByUserId(userId: string): Promise<string | null> {
  const employee = await prisma.employee.findUnique({ where: { userId } });
  return employee?.id ?? null;
}

export async function listDepartments() {
  return prisma.department.findMany({ orderBy: { name: "asc" } });
}

export async function listPositions(departmentId?: string) {
  return prisma.position.findMany({
    where: departmentId ? { departmentId } : undefined,
    include: { department: true },
    orderBy: { level: "asc" },
  });
}

function tryDecrypt(payload: string): string {
  try { return decrypt(payload); } catch { return ""; }
}
