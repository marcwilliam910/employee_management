export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  dateHired: string;
}

export interface EmployeeInput {
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  dateHired: string;
}

export interface DepartmentReport {
  department: string;
  employeeCount: number;
  totalSalary: number;
  averageSalary: number;
}
