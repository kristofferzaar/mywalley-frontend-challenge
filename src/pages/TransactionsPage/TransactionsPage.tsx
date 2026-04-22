import { useRef, useState } from 'react';
import { useGetTransactions } from '../../queries/useGetTransactions';
import { QueryWrapper } from '../../components/QueryWrapper';
import { Button } from '../../components/Button';
import { TransactionList } from './components/TransactionList';
import { FilterPanel } from './components/FilterPanel';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useAnalytics, ANALYTICS_EVENTS } from '../../hooks/useAnalytics';
import type { Transaction, TransactionFilters, SortOption } from '../../types/transaction';
import './TransactionsPage.scss';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Amount: high to low' },
  { value: 'amount_asc', label: 'Amount: low to high' },
];

function TransactionsContent({ data }: { data: Transaction[] }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { appliedFilters, filteredTransactions, filtersActive, sort, applyFilters, clearFilters, setSort } =
    useTransactionFilters(data);
  const { track } = useAnalytics();

  const activeFilterCount = [
    appliedFilters.status !== 'all',
    appliedFilters.paymentType !== 'all',
    appliedFilters.dateRange !== 'all',
    appliedFilters.search !== '',
  ].filter(Boolean).length;

  function handleTogglePanel() {
    const opening = !isPanelOpen;
    setIsPanelOpen(opening);
    if (opening) {
      track(ANALYTICS_EVENTS.FILTER_PANEL_OPENED);
    } else {
      track(ANALYTICS_EVENTS.FILTER_PANEL_ABANDONED);
    }
  }

  function closePanel() {
    setIsPanelOpen(false);
    toggleRef.current?.focus();
  }

  function handleApply(filters: TransactionFilters) {
    applyFilters(filters);
    track(ANALYTICS_EVENTS.FILTERS_APPLIED, {
      status: filters.status,
      paymentType: filters.paymentType,
      dateRange: filters.dateRange,
      resultCount: filteredTransactions.length,
    });
    if (filters.search) {
      track(ANALYTICS_EVENTS.SEARCH_PERFORMED, { query: filters.search, resultCount: filteredTransactions.length });
    }
    closePanel();
  }

  function handleSortChange(value: SortOption) {
    setSort(value);
    track(ANALYTICS_EVENTS.SORT_CHANGED, { sort: value });
  }

  function handleClear() {
    clearFilters();
    track(ANALYTICS_EVENTS.FILTERS_CLEARED);
  }

  const countLabel = filtersActive
    ? `Showing ${filteredTransactions.length} of ${data.length} transactions`
    : `Showing all ${data.length} transactions`;

  return (
    <>
      <div className="transactions-header">
        <label htmlFor="sort-select" className="sr-only">Sort by</label>
        <select
          id="sort-select"
          className="transactions-header__sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <Button
          ref={toggleRef}
          variant="outline"
          className={filtersActive ? 'is-active' : undefined}
          aria-expanded={isPanelOpen}
          aria-controls="filter-panel"
          onClick={handleTogglePanel}
        >
          {isPanelOpen
            ? 'Close'
            : activeFilterCount > 0
              ? `Filters (${activeFilterCount})`
              : 'Filters'}
        </Button>
      </div>

      {isPanelOpen && (
        <FilterPanel
          id="filter-panel"
          appliedFilters={appliedFilters}
          onApply={handleApply}
          onClear={handleClear}
        />
      )}

      <section className="transactions">
        <h2 className="transactions__count">{countLabel}</h2>
        {filteredTransactions.length === 0 ? (
          <div className="transactions-empty">
            <p>No transactions match your filters.</p>
            <Button variant="secondary" onClick={handleClear}>
              Clear filters
            </Button>
          </div>
        ) : (
          <TransactionList transactions={filteredTransactions} />
        )}
      </section>
    </>
  );
}

export function TransactionsPage() {
  const query = useGetTransactions();

  return (
    <>
      <h1>Transactions</h1>
      <QueryWrapper query={query} loadingMessage="Loading transactions">
        {(data) => <TransactionsContent data={data} />}
      </QueryWrapper>
    </>
  );
}
