// @vitest-environment node
import { formatTransactionLabel, STATUS_LABELS } from './transactionUtils';
import { formatCurrency } from './currencyUtils';
import { formatDate } from './dateUtils';
import type { Transaction } from '../types/transaction';

const mockTransaction: Transaction = {
  id: 'txn_001',
  merchantName: 'Spotify',
  totalAmount: 149,
  purchaseDate: '2024-01-15T00:00:00Z',
  status: 'completed',
  paymentType: 'full',
  paymentMethod: { type: 'credit_card', last4: '4242' },
};

describe('STATUS_LABELS', () => {
  it('maps all status values to capitalized display strings', () => {
    expect(STATUS_LABELS.completed).toBe('Completed');
    expect(STATUS_LABELS.pending).toBe('Pending');
    expect(STATUS_LABELS.failed).toBe('Failed');
    expect(STATUS_LABELS.cancelled).toBe('Cancelled');
    expect(STATUS_LABELS.active).toBe('Active');
  });
});

describe('formatTransactionLabel', () => {
  it('returns merchant, amount, status and date in the correct order for screen readers', () => {
    expect(formatTransactionLabel(mockTransaction)).toBe(
      `Spotify, ${formatCurrency(149)}, Completed, ${formatDate('2024-01-15T00:00:00Z')}, Credit card ending in 4242`
    );
  });

  it('uses the display label for status, not the raw value', () => {
    const failed = { ...mockTransaction, status: 'failed' } as Transaction;
    expect(formatTransactionLabel(failed)).toContain('Failed');
    expect(formatTransactionLabel(failed)).not.toContain('failed');
  });
});
