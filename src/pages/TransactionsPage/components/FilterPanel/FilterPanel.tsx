import { useEffect, useRef, useState } from 'react';
import type { TransactionFilters } from '../../../../types/transaction';
import { Button } from '../../../../components/Button';
import {
  DEFAULT_FILTERS,
  isFiltersActive,
  STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
} from '../../../../utils/transactionUtils';
import './FilterPanel.scss';

const TODAY = new Date().toISOString().split('T')[0];

const DATE_RANGE_OPTIONS: { value: TransactionFilters['dateRange']; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'last30', label: 'Last 30 days' },
  { value: 'last90', label: 'Last 3 months' },
  { value: 'lastYear', label: 'Last year' },
  { value: 'custom', label: 'Custom range' },
];

interface FilterPanelProps {
  id: string;
  appliedFilters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export function FilterPanel({ id, appliedFilters, onApply, onClear }: FilterPanelProps) {
  const [draft, setDraft] = useState<TransactionFilters>(appliedFilters);
  const firstSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setDraft(appliedFilters);
  }, [appliedFilters]);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    onApply(draft);
  }

  function handleClear() {
    setDraft(DEFAULT_FILTERS);
    onClear();
    firstSelectRef.current?.focus();
  }

  return (
    <form id={id} className="filter-panel" onSubmit={handleSubmit}>
      <div className="filter-panel__fields">
        <div className="filter-panel__field">
          <label htmlFor="filter-search">Merchant</label>
          <input
            id="filter-search"
            type="search"
            value={draft.search}
            placeholder="e.g. Spotify"
            onChange={(e) => setDraft({ ...draft, search: e.target.value })}
          />
        </div>
        <div className="filter-panel__field">
          <label htmlFor="filter-status">Status</label>
          <select
            ref={firstSelectRef}
            id="filter-status"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as TransactionFilters['status'] })}
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="filter-panel__field">
          <label htmlFor="filter-payment-type">Payment type</label>
          <select
            id="filter-payment-type"
            value={draft.paymentType}
            onChange={(e) => setDraft({ ...draft, paymentType: e.target.value as TransactionFilters['paymentType'] })}
          >
            <option value="all">All types</option>
            {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="filter-panel__field">
          <label htmlFor="filter-date-range">Date range</label>
          <select
            id="filter-date-range"
            value={draft.dateRange}
            onChange={(e) => setDraft({ ...draft, dateRange: e.target.value as TransactionFilters['dateRange'], dateFrom: '', dateTo: '' })}
          >
            {DATE_RANGE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {draft.dateRange === 'custom' && (
        <div className="filter-panel__date-range">
          <div className="filter-panel__field">
            <label htmlFor="filter-date-from">From</label>
            <input
              id="filter-date-from"
              type="date"
              value={draft.dateFrom}
              max={draft.dateTo || TODAY}
              onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
            />
          </div>
          <div className="filter-panel__field">
            <label htmlFor="filter-date-to">To</label>
            <input
              id="filter-date-to"
              type="date"
              value={draft.dateTo}
              min={draft.dateFrom || undefined}
              max={TODAY}
              onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="filter-panel__actions">
        {isFiltersActive(draft) && (
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear filters
          </Button>
        )}
        <Button type="submit">Apply filters</Button>
      </div>
    </form>
  );
}
