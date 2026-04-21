import { useRef, useState } from 'react';
import { useGetTransactions } from '../../queries/useGetTransactions';
import { QueryWrapper } from '../../components/QueryWrapper';
import { Button } from '../../components/Button';
import { TransactionList } from './components/TransactionList';
import { FilterPanel } from './components/FilterPanel';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import type { Transaction } from '../../types/transaction';
import './TransactionsPage.scss';

function TransactionsContent({ data }: { data: Transaction[] }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { appliedFilters, filteredTransactions, filtersActive, applyFilters, clearFilters } =
    useTransactionFilters(data);

  const activeFilterCount = [
    appliedFilters.status !== 'all',
    appliedFilters.paymentType !== 'all',
    appliedFilters.dateRange !== 'all',
  ].filter(Boolean).length;

  function closePanel() {
    setIsPanelOpen(false);
    toggleRef.current?.focus();
  }

  function handleApply(filters: typeof appliedFilters) {
    applyFilters(filters);
    closePanel();
  }

  function handleClear() {
    clearFilters();
  }

  const countLabel = filtersActive
    ? `Showing ${filteredTransactions.length} of ${data.length} transactions`
    : `Showing all ${data.length} transactions`;

  return (
    <>
      <div className="transactions-header">
        <Button
          ref={toggleRef}
          variant="outline"
          className={filtersActive ? 'is-active' : undefined}
          aria-expanded={isPanelOpen}
          aria-controls="filter-panel"
          onClick={() => setIsPanelOpen((open) => !open)}
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
