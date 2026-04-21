import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useGetTransaction } from '../../queries/useGetTransaction';
import { QueryWrapper } from '../../components/QueryWrapper';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate, formatTransactionDate } from '../../utils/dateUtils';
import {
  STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  needsAttention,
  getAttentionReason,
  deriveInstallmentSchedule,
} from '../../utils/transactionUtils';
import { TRANSACTIONS_QUERY_KEY } from '../../queries/useGetTransactions';
import type { Transaction, TransactionStatus } from '../../types/transaction';
import './TransactionDetailPage.scss';

function InstallmentSchedule({ transaction }: { transaction: Transaction }) {
  const { installmentPlan } = transaction;
  if (!installmentPlan) return null;

  const items = deriveInstallmentSchedule(installmentPlan);

  return (
    <section className="detail-section">
      <h2>Payment schedule</h2>
      <ul className="installment-schedule">
        {items.map((item) => (
          <li
            key={item.number}
            className={[
              'installment-schedule__item',
              item.paid && 'installment-schedule__item--paid',
              item.overdue && 'installment-schedule__item--overdue',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="installment-schedule__number">{item.number}</span>
            <span className="installment-schedule__date">{formatDate(item.date.toISOString())}</span>
            <span className="installment-schedule__amount">{formatCurrency(item.amount)}</span>
            <span className="installment-schedule__status">
              {item.paid ? 'Paid' : item.overdue ? 'Overdue' : 'Upcoming'}
            </span>
          </li>
        ))}
      </ul>
      <p className="installment-schedule__summary">
        {installmentPlan.paidInstallments} of {installmentPlan.totalInstallments} payments made
      </p>
    </section>
  );
}

function PayNowSection({ transaction, onPay }: { transaction: Transaction; onPay: () => void }) {
  const reason = getAttentionReason(transaction);
  if (!reason) return null;

  return (
    <section className="detail-pay-now">
      <p className="detail-pay-now__reason">{reason}</p>
      <Button onClick={onPay}>Pay now</Button>
      <p className="detail-pay-now__footnote">Using your default payment method</p>
    </section>
  );
}

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useGetTransaction(id ?? '');
  const queryClient = useQueryClient();

  function handlePayNow() {
    if (!window.confirm('Pay now using your default payment method?')) return;

    const patch = (t: Transaction): Transaction => ({ ...t, status: 'pending' as TransactionStatus });

    queryClient.setQueryData<Transaction>([TRANSACTIONS_QUERY_KEY, id], (old) =>
      old ? patch(old) : old
    );
    queryClient.setQueryData<Transaction[]>([TRANSACTIONS_QUERY_KEY], (old) =>
      old?.map((t) => (t.id === id ? patch(t) : t))
    );
  }

  return (
    <>
      <Link to="/transactions" className="back-link">← Transactions</Link>
      <QueryWrapper query={query} loadingMessage="Loading transaction">
        {(transaction) => (
          <>
            <h1>{transaction.merchantName}</h1>

            <div className="detail-hero">
              <span className="detail-hero__amount">{formatCurrency(transaction.totalAmount)}</span>
              <span className={`detail-hero__status detail-hero__status--${transaction.status}`}>
                {needsAttention(transaction)
                  ? getAttentionReason(transaction)
                  : STATUS_LABELS[transaction.status]}
              </span>
            </div>

            <section className="detail-section">
              <h2>Purchase details</h2>
              <dl className="detail-list">
                <dt>Date</dt>
                <dd>{formatTransactionDate(transaction.purchaseDate)}</dd>
                <dt>Payment type</dt>
                <dd>{PAYMENT_TYPE_LABELS[transaction.paymentType]}</dd>
                <dt>Payment method</dt>
                <dd>
                  {PAYMENT_METHOD_LABELS[transaction.paymentMethod.type]}{' '}
                  <span aria-hidden="true">&bull;&bull;&bull;&bull;</span>
                  <span className="sr-only">ending in</span>{' '}
                  {transaction.paymentMethod.last4}
                </dd>
              </dl>
            </section>

            <InstallmentSchedule transaction={transaction} />

            {needsAttention(transaction) && (
              <PayNowSection transaction={transaction} onPay={handlePayNow} />
            )}
          </>
        )}
      </QueryWrapper>
    </>
  );
}
