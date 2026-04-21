import { Link } from 'react-router-dom';
import type { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatDate } from '../../../utils/dateUtils';
import { STATUS_LABELS, formatTransactionLabel } from '../../../utils/transactionUtils';
import './TransactionListItem.scss';

interface TransactionListItemProps {
  transaction: Transaction;
}

export function TransactionListItem({ transaction }: TransactionListItemProps) {
  const { id, merchantName, totalAmount, status, purchaseDate } = transaction;
  return (
    <li>
      <Link
        to={`/transactions/${id}`}
        className="transaction-list-item"
        aria-label={formatTransactionLabel(transaction)}
      >
        <div className="transaction-list-item__content">
          <span className="transaction-list-item__amount">{formatCurrency(totalAmount)}</span>
          <span className="transaction-list-item__merchant">{merchantName}</span>
          <span className="transaction-list-item__date">{formatDate(purchaseDate)}</span>
        </div>
        <div className="transaction-list-item__meta">
          <span
            className={`transaction-list-item__status transaction-list-item__status--${status}`}
          >
            {STATUS_LABELS[status]}
          </span>
          <span className="transaction-list-item__chevron" aria-hidden="true">
            &rsaquo;
          </span>
        </div>
      </Link>
    </li>
  );
}
