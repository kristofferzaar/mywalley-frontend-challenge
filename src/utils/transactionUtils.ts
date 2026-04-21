import type {
  Transaction,
  TransactionStatus,
  PaymentMethodType,
  TransactionFilters,
  DateRangeOption,
} from '../types/transaction';
import type { PaymentType } from '../types/transaction';
import { formatCurrency } from './currencyUtils';
import { formatDate, isPastDate, isDateInRange } from './dateUtils';

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  full: 'Full payment',
  installment: 'Installment',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  credit_card: 'Credit card',
  debit_card: 'Debit card',
  bank_account: 'Bank account',
};

export const STATUS_LABELS: Record<TransactionStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export function formatTransactionLabel(
  { merchantName, totalAmount, status, purchaseDate, paymentMethod }: Transaction,
  attentionReason?: string
): string {
  const statusLabel = attentionReason ?? STATUS_LABELS[status];
  return `${merchantName}, ${formatCurrency(totalAmount)}, ${statusLabel}, ${formatDate(purchaseDate)}, ${PAYMENT_METHOD_LABELS[paymentMethod.type]} ending in ${paymentMethod.last4}`;
}

export function getAttentionReason(transaction: Transaction): string | null {
  if (transaction.status === 'failed') return 'Payment failed';
  if (
    transaction.status === 'active' &&
    transaction.installmentPlan &&
    isPastDate(transaction.installmentPlan.nextPaymentDate)
  )
    return 'Payment overdue';
  return null;
}

export function needsAttention(transaction: Transaction): boolean {
  if (transaction.status === 'failed') return true;
  if (
    transaction.status === 'active' &&
    transaction.installmentPlan &&
    isPastDate(transaction.installmentPlan.nextPaymentDate)
  )
    return true;
  return false;
}

export function getRecentTransactions(transactions: Transaction[], count: number): Transaction[] {
  return [...transactions]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, count);
}

export const DEFAULT_FILTERS: TransactionFilters = {
  status: 'all',
  paymentType: 'all',
  dateRange: 'all',
  dateFrom: '',
  dateTo: '',
};

export function filterByStatus(
  transactions: Transaction[],
  status: TransactionStatus | 'all'
): Transaction[] {
  if (status === 'all') return transactions;
  return transactions.filter((t) => t.status === status);
}

export function filterByPaymentType(
  transactions: Transaction[],
  paymentType: PaymentType | 'all'
): Transaction[] {
  if (paymentType === 'all') return transactions;
  return transactions.filter((t) => t.paymentType === paymentType);
}

function getDateRangeCutoff(dateRange: DateRangeOption): Date | null {
  const now = new Date();
  if (dateRange === 'last30') return new Date(now.setDate(now.getDate() - 30));
  if (dateRange === 'last90') return new Date(now.setDate(now.getDate() - 90));
  if (dateRange === 'lastYear') return new Date(now.setFullYear(now.getFullYear() - 1));
  return null;
}

export function filterByDateRange(
  transactions: Transaction[],
  dateRange: DateRangeOption,
  dateFrom: string,
  dateTo: string
): Transaction[] {
  if (dateRange === 'all') return transactions;
  if (dateRange === 'custom') {
    return transactions.filter((t) => {
      if (dateFrom && dateTo) return isDateInRange(t.purchaseDate, dateFrom, dateTo);
      if (dateFrom) return new Date(t.purchaseDate) >= new Date(dateFrom);
      if (dateTo) return new Date(t.purchaseDate) <= new Date(dateTo);
      return true;
    });
  }
  const cutoff = getDateRangeCutoff(dateRange);
  if (!cutoff) return transactions;
  return transactions.filter((t) => new Date(t.purchaseDate) >= cutoff);
}

export function applyFilters(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
  return filterByDateRange(
    filterByPaymentType(filterByStatus(transactions, filters.status), filters.paymentType),
    filters.dateRange,
    filters.dateFrom,
    filters.dateTo
  );
}

export function isFiltersActive(filters: TransactionFilters): boolean {
  return (
    filters.status !== DEFAULT_FILTERS.status ||
    filters.paymentType !== DEFAULT_FILTERS.paymentType ||
    filters.dateRange !== DEFAULT_FILTERS.dateRange
  );
}
