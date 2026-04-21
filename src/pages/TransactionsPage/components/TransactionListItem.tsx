import { Link } from 'react-router-dom';
import type { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatTransactionDate } from '../../../utils/dateUtils';
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
        aria-label={formatTransactionLabel(transaction)}
      >
        <div className="transaction-list-item__content">
          <span className="transaction-list-item__amount">{formatCurrency(totalAmount)}</span>
          <span className="transaction-list-item__merchant">{merchantName}</span>
          <span className="transaction-list-item__date">{formatTransactionDate(purchaseDate)}</span>
          <span className="transaction-list-item__payment-method">
            {PAYMENT_METHOD_LABELS[paymentMethod.type]} &bull;&bull;&bull;&bull;{' '}
            {paymentMethod.last4}
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
