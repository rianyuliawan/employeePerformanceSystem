import type { Request, Response } from "express";
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignWalletToUser,
  listDepartments,
  listPositions,
} from "../services/employee.service.js";
import { logAudit } from "../services/audit.service.js";
import { ok, fail } from "../utils/response.js";

export async function listEmployeesController(_req: Request, res: Response) {
  return ok(res, "Employees loaded", await listEmployees());
}

export async function getEmployeeController(req: Request, res: Response) {
  const data = await getEmployee(req.params.id);
  if (!data) return fail(res, "Employee not found", 404);
  return ok(res, "Employee loaded", data);
}

export async function createEmployeeController(req: Request, res: Response) {
  const data = await createEmployee(req.body);
  await logAudit({
    userId: req.user!.id,
    activity: "create_employee",
    detail: `Created employee ${data.employeeCode} (${data.fullName})`,
    ipAddress: req.ip,
  });
  return ok(res, "Employee created", data, 201);
}

export async function updateEmployeeController(req: Request, res: Response) {
  const data = await updateEmployee(req.params.id, req.body);
  await logAudit({
    userId: req.user!.id,
    activity: "update_employee",
    detail: `Updated employee ${req.params.id}: ${Object.keys(req.body).join(", ")}`,
    ipAddress: req.ip,
  });
  return ok(res, "Employee updated", data);
}

export async function deleteEmployeeController(req: Request, res: Response) {
  await deleteEmployee(req.params.id);
  await logAudit({
    userId: req.user!.id,
    activity: "deactivate_employee",
    detail: `Deactivated employee ${req.params.id}`,
    ipAddress: req.ip,
  });
  return ok(res, "Employee deactivated", null);
}

export async function assignWalletController(req: Request, res: Response) {
  const { userId, walletAddress } = req.body;
  if (!userId || !walletAddress) return fail(res, "userId and walletAddress required", 400);
  const updated = await assignWalletToUser(userId, walletAddress);
  await logAudit({
    userId: req.user!.id,
    activity: "assign_wallet",
    detail: `Assigned ${walletAddress} to user ${userId} (${updated.name})`,
    ipAddress: req.ip,
  });
  return ok(res, "Wallet assigned", { userId, walletAddress, name: updated.name });
}

export async function listDepartmentsController(_req: Request, res: Response) {
  return ok(res, "Departments loaded", await listDepartments());
}

export async function listPositionsController(req: Request, res: Response) {
  const { departmentId } = req.query;
  return ok(res, "Positions loaded", await listPositions(departmentId as string));
}
