import { useSearchParams } from 'react-router-dom';
import type { Transaction, TransactionFilters } from '../../../types/transaction';
import {
  applyFilters as applyFiltersFn,
  isFiltersActive,
  DEFAULT_FILTERS,
} from '../../../utils/transactionUtils';

function filtersFromParams(params: URLSearchParams): TransactionFilters {
  return {
    status: (params.get('status') as TransactionFilters['status']) ?? DEFAULT_FILTERS.status,
    paymentType:
      (params.get('paymentType') as TransactionFilters['paymentType']) ?? DEFAULT_FILTERS.paymentType,
    dateRange:
      (params.get('dateRange') as TransactionFilters['dateRange']) ?? DEFAULT_FILTERS.dateRange,
    dateFrom: params.get('dateFrom') ?? DEFAULT_FILTERS.dateFrom,
    dateTo: params.get('dateTo') ?? DEFAULT_FILTERS.dateTo,
  };
}

function filtersToParams(filters: TransactionFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.status !== DEFAULT_FILTERS.status) params.status = filters.status;
  if (filters.paymentType !== DEFAULT_FILTERS.paymentType) params.paymentType = filters.paymentType;
  if (filters.dateRange !== DEFAULT_FILTERS.dateRange) params.dateRange = filters.dateRange;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  return params;
}

export function useTransactionFilters(transactions: Transaction[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const appliedFilters = filtersFromParams(searchParams);
  const filteredTransactions = applyFiltersFn(transactions, appliedFilters);
  const filtersActive = isFiltersActive(appliedFilters);

  function applyFilters(filters: TransactionFilters) {
    setSearchParams(filtersToParams(filters), { replace: true });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  return { appliedFilters, filteredTransactions, filtersActive, applyFilters, clearFilters };
}
