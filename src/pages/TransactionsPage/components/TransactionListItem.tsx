import { Link } from 'react-router-dom';
import type { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatDate } from '../../../utils/dateUtils';
import { STATUS_LABELS, PAYMENT_METHOD_LABELS, formatTransactionLabel } from '../../../utils/transactionUtils';
import './TransactionListItem.scss';

interface TransactionListItemProps {
  transaction: Transaction;
  attentionReason?: string;
}

export function TransactionListItem({ transaction, attentionReason }: TransactionListItemProps) {
  const { id, merchantName, totalAmount, status, purchaseDate, paymentMethod } = transaction;
  return (
    <li>
      <Link
        to={`/transactions/${id}`}
        className="transaction-list-item"
        aria-label={formatTransactionLabel(transaction, attentionReason)}
      >
        <div className="transaction-list-item__content">
          <span className="transaction-list-item__amount">{formatCurrency(totalAmount)}</span>
          <span className="transaction-list-item__merchant">{merchantName}</span>
          <span className="transaction-list-item__date">{formatDate(purchaseDate)}</span>
          <span className="transaction-list-item__payment-method">
            <span aria-hidden="true">{PAYMENT_METHOD_LABELS[paymentMethod.type]} &bull;&bull;&bull;&bull;</span>
            <span className="sr-only">{PAYMENT_METHOD_LABELS[paymentMethod.type]} ending in</span>
            {' '}{paymentMethod.last4}
          </span>
        </div>
        <div className="transaction-list-item__meta">
          {attentionReason ? (
            <span className="transaction-list-item__status transaction-list-item__status--failed">
              {attentionReason}
            </span>
          ) : (
            <span
              className={`transaction-list-item__status transaction-list-item__status--${status}`}
            >
              {STATUS_LABELS[status]}
            </span>
          )}
          <span className="transaction-list-item__chevron" aria-hidden="true">
            &rsaquo;
          </span>
        </div>
      </Link>
    </li>
  );
}
