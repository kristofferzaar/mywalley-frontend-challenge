import type { Transaction, TransactionStatus, PaymentMethodType } from '../types/transaction';
import { formatCurrency } from './currencyUtils';
import { formatDate, isPastDate } from './dateUtils';

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
