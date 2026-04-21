import { useState } from 'react';
import type { Transaction, TransactionFilters } from '../../../types/transaction';
import {
  applyFilters as applyFiltersFn,
  isFiltersActive,
  DEFAULT_FILTERS,
} from '../../../utils/transactionUtils';

export function useTransactionFilters(transactions: Transaction[]) {
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);

  const filteredTransactions = applyFiltersFn(transactions, appliedFilters);
  const filtersActive = isFiltersActive(appliedFilters);

  function applyFilters(filters: TransactionFilters) {
    setAppliedFilters(filters);
  }

  function clearFilters() {
    setAppliedFilters(DEFAULT_FILTERS);
  }

  return { appliedFilters, filteredTransactions, filtersActive, applyFilters, clearFilters };
}
