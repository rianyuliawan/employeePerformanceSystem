export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Employee = {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string;
  address: string;
  departmentName: string;
  positionName: string;
  hireDate: string;
  status: boolean;
};

export type DashboardData = {
  totalEmployee: number;
  totalEvaluation: number;
  pendingPromotion: number;
  latestTransaction: Array<{
    evaluationId: string;
    transactionHash?: string;
    status: string;
    createdAt: string;
  }>;
};

