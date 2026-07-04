import { Router } from "express";
import {
  listEmployeesController,
  getEmployeeController,
  createEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
  assignWalletController,
  listDepartmentsController,
  listPositionsController,
} from "../controllers/employee.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { employeeSchema, updateEmployeeSchema } from "../validation/schemas.js";

export const employeeRoutes = Router();
employeeRoutes.use(authMiddleware);

employeeRoutes.get("/", listEmployeesController);
employeeRoutes.get("/departments", listDepartmentsController);
employeeRoutes.get("/positions", listPositionsController);
employeeRoutes.get("/:id", getEmployeeController);
employeeRoutes.post("/", roleMiddleware(["HR"]), validateBody(employeeSchema), createEmployeeController);
employeeRoutes.put("/:id", roleMiddleware(["HR"]), validateBody(updateEmployeeSchema), updateEmployeeController);
employeeRoutes.delete("/:id", roleMiddleware(["HR"]), deleteEmployeeController);
employeeRoutes.post("/assign-wallet", roleMiddleware(["HR", "Director"]), assignWalletController);
