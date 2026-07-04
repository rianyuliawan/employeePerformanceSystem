import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const walletLoginSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  signature: z.string().min(1)
});

export const registerWalletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["HR", "Manager", "Director", "Employee"])
});

export const employeeSchema = z.object({
  employeeCode: z.string().min(2),
  fullName: z.string().min(2),
  phone: z.string().min(5),
  address: z.string().min(3),
  departmentId: z.string().min(1),
  positionId: z.string().min(1),
  hireDate: z.string().default(() => new Date().toISOString().slice(0, 10)),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["HR", "Manager", "Director", "Employee"]).optional()
});

export const updateEmployeeSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  address: z.string().min(3).optional(),
  departmentId: z.string().min(1).optional(),
  positionId: z.string().min(1).optional()
});

export const evaluationSchema = z.object({
  employeeId: z.string().min(1),
  periodId: z.string().min(1),
  scores: z.array(z.object({
    indicator: z.string().min(2),
    score: z.number().min(0).max(100),
    weight: z.number().min(0).max(1).default(1)
  })).min(1),
  comment: z.string().max(1000),
  documentText: z.string().optional()
});

export const promotionSchema = z.object({
  evaluationId: z.string().min(1),
  employeeId: z.string().min(1),
  targetPositionId: z.string().min(1),
  reason: z.string().min(5)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6)
});

export const resetPasswordSchema = z.object({
  userId: z.string().min(1),
  newPassword: z.string().min(6)
});

