import { randomUUID } from "node:crypto";

export type EmployeeRecord = {
  id: string;
  employeeCode: string;
  fullName: string;
  phoneEncrypted: string;
  addressEncrypted: string;
  departmentName: string;
  positionName: string;
  hireDate: string;
  status: boolean;
};

export type EvaluationRecord = {
  id: string;
  employeeId: string;
  managerId: string;
  periodName: string;
  totalScore: number;
  encryptedComment: string;
  documentHash: string;
  blockchainStatus: "Pending" | "Success" | "Failed";
  transactionHash?: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved";
  createdAt: string;
};

const employees: EmployeeRecord[] = [
  {
    id: "emp-001",
    employeeCode: "EMP001",
    fullName: "John Doe",
    phoneEncrypted: "",
    addressEncrypted: "",
    departmentName: "Engineering",
    positionName: "Senior Developer",
    hireDate: "2022-01-10",
    status: true
  }
];

const evaluations: EvaluationRecord[] = [];

export const memoryRepository = {
  listEmployees: () => employees,
  createEmployee: (data: Omit<EmployeeRecord, "id" | "status">) => {
    const record = { id: randomUUID(), status: true, ...data };
    employees.push(record);
    return record;
  },
  updateEmployee: (id: string, data: Partial<EmployeeRecord>) => {
    const index = employees.findIndex((employee) => employee.id === id);
    if (index < 0) return null;
    employees[index] = { ...employees[index], ...data };
    return employees[index];
  },
  deleteEmployee: (id: string) => {
    const index = employees.findIndex((employee) => employee.id === id);
    if (index < 0) return false;
    employees.splice(index, 1);
    return true;
  },
  createEvaluation: (data: Omit<EvaluationRecord, "id" | "createdAt">) => {
    const record = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
    evaluations.push(record);
    return record;
  },
  listEvaluations: () => evaluations,
  findEvaluation: (id: string) => evaluations.find((evaluation) => evaluation.id === id),
  updateEvaluationStatus: (id: string, status: EvaluationRecord["status"]) => {
    const evaluation = evaluations.find((item) => item.id === id);
    if (!evaluation) return null;
    evaluation.status = status;
    return evaluation;
  },
  dashboard: () => ({
    totalEmployee: employees.length,
    totalEvaluation: evaluations.length,
    pendingPromotion: 0,
    latestTransaction: evaluations.slice(-5).map((item) => ({
      evaluationId: item.id,
      transactionHash: item.transactionHash,
      status: item.blockchainStatus,
      createdAt: item.createdAt
    }))
  })
};

