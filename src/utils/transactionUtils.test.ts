// @vitest-environment node
import {
  formatTransactionLabel,
  STATUS_LABELS,
  filterByStatus,
  filterByPaymentType,
  filterByDateRange,
  applyFilters,
  DEFAULT_FILTERS,
} from './transactionUtils';
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

const recentTransaction: Transaction = {
  ...mockTransaction,
  id: 'txn_recent',
  purchaseDate: new Date().toISOString(),
};

const oldTransaction: Transaction = {
  ...mockTransaction,
  id: 'txn_old',
  purchaseDate: '2020-01-01T00:00:00Z',
};

describe('filterByStatus', () => {
  it("returns all transactions when status is 'all'", () => {
    expect(filterByStatus([mockTransaction, recentTransaction], 'all')).toHaveLength(2);
  });

  it('filters to only matching status', () => {
    const pending = { ...mockTransaction, id: 'txn_p', status: 'pending' } as Transaction;
    const result = filterByStatus([mockTransaction, pending], 'pending');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('txn_p');
  });
});

describe('filterByPaymentType', () => {
  it("returns all transactions when paymentType is 'all'", () => {
    expect(filterByPaymentType([mockTransaction], 'all')).toHaveLength(1);
  });

  it('filters to only matching payment type', () => {
    const installment = { ...mockTransaction, id: 'txn_i', paymentType: 'installment' } as Transaction;
    const result = filterByPaymentType([mockTransaction, installment], 'installment');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('txn_i');
  });
});

describe('filterByDateRange', () => {
  it("returns all transactions when dateRange is 'all'", () => {
    expect(filterByDateRange([recentTransaction, oldTransaction], 'all', '', '')).toHaveLength(2);
  });

  it("'last30' excludes transactions older than 30 days", () => {
    const result = filterByDateRange([recentTransaction, oldTransaction], 'last30', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('txn_recent');
  });

  it("'custom' filters by dateFrom and dateTo", () => {
    const result = filterByDateRange(
      [recentTransaction, oldTransaction],
      'custom',
      '2019-01-01',
      '2020-12-31'
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('txn_old');
  });
});

describe('applyFilters', () => {
  it('applies all filters together', () => {
    const installmentRecent: Transaction = {
      ...recentTransaction,
      id: 'txn_ir',
      paymentType: 'installment',
      status: 'active',
    };
    const result = applyFilters([recentTransaction, oldTransaction, installmentRecent], {
      ...DEFAULT_FILTERS,
      paymentType: 'installment',
      status: 'active',
      dateRange: 'last30',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('txn_ir');
  });
});
