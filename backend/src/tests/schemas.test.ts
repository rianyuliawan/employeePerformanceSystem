import { describe, it, expect } from "vitest";
import {
  evaluationSchema,
  promotionSchema,
  employeeSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../validation/schemas.js";

describe("evaluationSchema", () => {
  it("keeps periodId after parsing (regression: used to be stripped when the field was named periodName)", () => {
    const result = evaluationSchema.safeParse({
      employeeId: "emp-1",
      periodId: "period-1",
      comment: "ok",
      scores: [{ indicator: "Discipline", score: 90, weight: 0.5 }],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.periodId).toBe("period-1");
  });

  it("rejects a payload missing periodId", () => {
    const result = evaluationSchema.safeParse({
      employeeId: "emp-1",
      comment: "ok",
      scores: [{ indicator: "Discipline", score: 90, weight: 0.5 }],
    });
    expect(result.success).toBe(false);
  });
});

describe("promotionSchema", () => {
  it("accepts the fields the controller actually uses", () => {
    const result = promotionSchema.safeParse({
      evaluationId: "eval-1",
      employeeId: "emp-1",
      targetPositionId: "pos-1",
      reason: "Kinerja sangat baik",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a payload missing reason", () => {
    const result = promotionSchema.safeParse({
      evaluationId: "eval-1",
      employeeId: "emp-1",
      targetPositionId: "pos-1",
    });
    expect(result.success).toBe(false);
  });
});

describe("employeeSchema", () => {
  it("requires departmentId/positionId (not the old departmentName/positionName shape)", () => {
    const result = employeeSchema.safeParse({
      employeeCode: "EMP-999",
      fullName: "Test User",
      phone: "0812345678",
      address: "Jl. Test",
      departmentId: "dept-1",
      positionId: "pos-1",
      email: "test@company.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});

describe("password schemas", () => {
  it("changePasswordSchema rejects a new password shorter than 6 chars", () => {
    const result = changePasswordSchema.safeParse({ currentPassword: "old", newPassword: "abc" });
    expect(result.success).toBe(false);
  });

  it("resetPasswordSchema requires both userId and newPassword", () => {
    const result = resetPasswordSchema.safeParse({ userId: "user-1", newPassword: "newpass123" });
    expect(result.success).toBe(true);
  });
});
