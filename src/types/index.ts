export type TransactionType = "income" | "expense";
export type PaymentMethod = "credit_card" | "debit_card" | "cash" | "bank_transfer" | "paypal";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  merchant: string;
  date: string; // ISO string
  paymentMethod: PaymentMethod;
  notes?: string;
  status: "completed" | "pending" | "failed";
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number; // The limit
  spent: number;
  month: string; // YYYY-MM
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  balanceChange: number; // percentage
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currency: string;
}
