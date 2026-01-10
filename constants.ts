import { Loan, LoanStatus, ComplianceStatus } from './types';

export const MOCK_LOANS: Loan[] = [
  {
    id: 'ln_001',
    borrower: 'Acme Corp Industrial',
    amount: 15000000,
    currency: 'USD',
    startDate: '2023-01-15',
    maturityDate: '2028-01-15',
    status: LoanStatus.Active,
    complianceScore: 92,
    covenants: [
      {
        id: 'cov_1',
        title: 'Quarterly Financials',
        type: 'Reporting',
        dueDate: '2024-03-31',
        status: ComplianceStatus.Compliant,
        description: 'Submission of unaudited quarterly financial statements within 45 days of quarter end.',
      },
      {
        id: 'cov_2',
        title: 'Leverage Ratio',
        type: 'Financial',
        dueDate: '2024-03-31',
        status: ComplianceStatus.AtRisk,
        value: '3.9x',
        threshold: '< 4.0x',
        description: 'Total Net Debt to EBITDA must not exceed 4.0x.',
      },
      {
        id: 'cov_3',
        title: 'Interest Coverage',
        type: 'Financial',
        dueDate: '2024-06-30',
        status: ComplianceStatus.Upcoming,
        threshold: '> 2.5x',
        description: 'EBITDA to Interest Expense ratio must be maintained above 2.5x.',
      },
    ],
  },
  {
    id: 'ln_002',
    borrower: 'Helios Energy Ltd',
    amount: 45000000,
    currency: 'USD',
    startDate: '2022-06-01',
    maturityDate: '2027-06-01',
    status: LoanStatus.Active,
    complianceScore: 78,
    covenants: [
      {
        id: 'cov_4',
        title: 'Annual Audit',
        type: 'Reporting',
        dueDate: '2023-12-31',
        status: ComplianceStatus.Compliant,
        description: 'Audited annual financials by KPMG or equivalent.',
      },
      {
        id: 'cov_5',
        title: 'Debt Service Coverage',
        type: 'Financial',
        dueDate: '2024-03-31',
        status: ComplianceStatus.Breached,
        value: '1.1x',
        threshold: '> 1.25x',
        description: 'DSCR must be greater than 1.25x calculated on a rolling 12-month basis.',
      },
    ],
  },
  {
    id: 'ln_003',
    borrower: 'Omni Retail Group',
    amount: 8500000,
    currency: 'USD',
    startDate: '2023-09-01',
    maturityDate: '2026-09-01',
    status: LoanStatus.Pending,
    complianceScore: 100,
    covenants: [],
  },
];

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } },
  },
};
