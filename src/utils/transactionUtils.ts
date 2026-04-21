import type { Transaction, TransactionStatus } from '../types/transaction';
import { formatCurrency } from './currencyUtils';
import { formatDate } from './dateUtils';

export const STATUS_LABELS: Record<TransactionStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export function formatTransactionLabel({ merchantName, totalAmount, status, purchaseDate }: Transaction): string {
  return `${merchantName}, ${formatCurrency(totalAmount)}, ${STATUS_LABELS[status]}, ${formatDate(purchaseDate)}`;
}
