import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatTransactionDate } from '../../../utils/dateUtils';
import { formatTransactionLabel, STATUS_LABELS } from '../../../utils/transactionUtils';
import { TransactionListItem } from './TransactionListItem';

const mockTransaction: Transaction = {
  id: 'txn_001',
  merchantName: 'Spotify',
  totalAmount: 9900,
  purchaseDate: '2024-01-15T00:00:00Z',
  status: 'completed',
  paymentType: 'full',
  paymentMethod: { type: 'credit_card', last4: '4242' },
};

function renderItem(props: Partial<React.ComponentProps<typeof TransactionListItem>> = {}) {
  return render(
    <MemoryRouter>
      <ul>
        <TransactionListItem transaction={mockTransaction} {...props} />
      </ul>
    </MemoryRouter>
  );
}

describe('TransactionListItem', () => {
  describe('rendering', () => {
    it('renders the merchant name', () => {
      renderItem();
      expect(screen.getByText('Spotify')).toBeInTheDocument();
    });

    it('renders the formatted amount', () => {
      const { container } = renderItem();
      expect(container.querySelector('.transaction-list-item__amount')?.textContent).toBe(formatCurrency(9900));
    });

    it('renders the formatted purchase date', () => {
      renderItem();
      expect(screen.getByText(formatTransactionDate('2024-01-15T00:00:00Z'))).toBeInTheDocument();
    });

    it('renders the payment method type and last 4 digits', () => {
      renderItem();
      expect(screen.getByText(/Credit card/)).toBeInTheDocument();
      expect(screen.getByText(/4242/)).toBeInTheDocument();
    });
  });

  describe('link', () => {
    it('links to the transaction detail page', () => {
      renderItem();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/transactions/txn_001');
    });
  });

  describe('accessibility', () => {
    it('sets aria-label from formatTransactionLabel', () => {
      renderItem();
      expect(screen.getByRole('link')).toHaveAttribute(
        'aria-label',
        formatTransactionLabel(mockTransaction)
      );
    });
  });

  describe('status badge', () => {
    it('shows the status label when no attentionReason is provided', () => {
      renderItem();
      expect(screen.getByText(STATUS_LABELS.completed)).toBeInTheDocument();
    });

    it('applies the status-based class to the badge', () => {
      renderItem();
      const badge = screen.getByText(STATUS_LABELS.completed);
      expect(badge).toHaveClass('transaction-list-item__status--completed');
    });

    it('shows attentionReason text instead of status label when provided', () => {
      renderItem({ attentionReason: 'Payment failed' });
      expect(screen.getByText('Payment failed')).toBeInTheDocument();
      expect(screen.queryByText(STATUS_LABELS.completed)).not.toBeInTheDocument();
    });

    it('applies the --failed class when attentionReason is provided', () => {
      renderItem({ attentionReason: 'Payment failed' });
      expect(screen.getByText('Payment failed')).toHaveClass(
        'transaction-list-item__status--failed'
      );
    });
  });

  describe('onClick', () => {
    // onClick is used by OverviewPage to fire analytics when an attention item is tapped
    it('calls onClick when the link is clicked', () => {
      const onClick = vi.fn();
      renderItem({ onClick });
      fireEvent.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });
});
