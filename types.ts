export enum LoanStatus {
  Active = 'Active',
  Pending = 'Pending',
  Closed = 'Closed',
}

export enum ComplianceStatus {
  Compliant = 'Compliant',
  AtRisk = 'At Risk',
  Breached = 'Breached',
  Upcoming = 'Upcoming',
}

export interface Covenant {
  id: string;
  title: string;
  type: 'Financial' | 'Reporting' | 'Affirmative' | 'Negative';
  dueDate: string;
  status: ComplianceStatus;
  value?: string;
  threshold?: string;
  description: string;
}

export interface Loan {
  id: string;
  borrower: string;
  amount: number;
  currency: string;
  interestRate: number; // New field
  startDate: string;
  maturityDate: string;
  status: LoanStatus;
  complianceScore: number;
  covenants: Covenant[];
  riskSummary?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type ViewState = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'LOAN_LIST' | 'LOAN_DETAIL' | 'REPORTS' | 'SETTINGS';
