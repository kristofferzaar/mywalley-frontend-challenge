export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled' | 'active';

export type PaymentType = 'full' | 'installment';

export type PaymentMethodType = 'credit_card' | 'bank_account' | 'debit_card';

export type InstallmentFrequency = 'biweekly' | 'monthly';

export interface PaymentMethod {
  type: PaymentMethodType;
  last4: string;
}

export interface InstallmentPlan {
  totalInstallments: number;
  installmentAmount: number;
  paidInstallments: number;
  nextPaymentDate: string;
  frequency: InstallmentFrequency;
}

export interface Transaction {
  id: string;
  merchantName: string;
  totalAmount: number;
  purchaseDate: string;
  status: TransactionStatus;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  installmentPlan?: InstallmentPlan;
}

export interface TransactionsData {
  transactions: Transaction[];
}

export type DateRangeOption = 'last30' | 'last90' | 'lastYear' | 'custom' | 'all';

export interface TransactionFilters {
  status: TransactionStatus | 'all';
  paymentType: PaymentType | 'all';
  dateRange: DateRangeOption;
  dateFrom: string;
  dateTo: string;
}
