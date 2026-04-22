import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Transaction, TransactionFilters, SortOption } from '../../../types/transaction';
import {
  applyFilters as applyFiltersFn,
  isFiltersActive,
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  sortTransactions,
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
    search: params.get('search') ?? DEFAULT_FILTERS.search,
  };
}

function filtersToParams(filters: TransactionFilters, sort: SortOption): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.status !== DEFAULT_FILTERS.status) params.status = filters.status;
  if (filters.paymentType !== DEFAULT_FILTERS.paymentType) params.paymentType = filters.paymentType;
  if (filters.dateRange !== DEFAULT_FILTERS.dateRange) params.dateRange = filters.dateRange;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.search) params.search = filters.search;
  if (sort !== DEFAULT_SORT) params.sort = sort;
  return params;
}

export function useTransactionFilters(transactions: Transaction[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const appliedFilters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const sort = useMemo(
    () => (searchParams.get('sort') as SortOption) ?? DEFAULT_SORT,
    [searchParams]
  );
  const filteredTransactions = useMemo(
    () => sortTransactions(applyFiltersFn(transactions, appliedFilters), sort),
    [transactions, appliedFilters, sort]
  );
  const filtersActive = useMemo(() => isFiltersActive(appliedFilters), [appliedFilters]);

  function applyFilters(filters: TransactionFilters) {
    setSearchParams(filtersToParams(filters, sort), { replace: true });
  }

  function clearFilters() {
    const params: Record<string, string> = {};
    if (sort !== DEFAULT_SORT) params.sort = sort;
    setSearchParams(params, { replace: true });
  }

  function setSort(value: SortOption) {
    setSearchParams(filtersToParams(appliedFilters, value), { replace: true });
  }

  return { appliedFilters, filteredTransactions, filtersActive, sort, applyFilters, clearFilters, setSort };
}
