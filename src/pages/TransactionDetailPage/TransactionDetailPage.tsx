import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useGetTransaction } from '../../queries/useGetTransaction';
import { QueryWrapper } from '../../components/QueryWrapper';
import { Button } from '../../components/Button';
import { useAnalytics, ANALYTICS_EVENTS } from '../../hooks/useAnalytics';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate, formatTransactionDate } from '../../utils/dateUtils';
import {
  STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  needsAttention,
  getAttentionReason,
  deriveInstallmentSchedule,
  applyInstallmentPayment,
} from '../../utils/transactionUtils';
import { TRANSACTIONS_QUERY_KEY } from '../../queries/useGetTransactions';
import type { Transaction, TransactionStatus } from '../../types/transaction';
import './TransactionDetailPage.scss';

function InstallmentSchedule({
  transaction,
  onPayInstallment,
}: {
  transaction: Transaction;
  onPayInstallment?: () => void;
}) {
  const { installmentPlan } = transaction;
  if (!installmentPlan) return null;

  const items = deriveInstallmentSchedule(installmentPlan);
  const firstOverdueNumber = items.find((i) => i.overdue)?.number;

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
            {item.number === firstOverdueNumber && onPayInstallment ? (
              <Button
                variant="outline"
                className="installment-schedule__pay-btn"
                onClick={() => onPayInstallment()}
              >
                Pay now
              </Button>
            ) : (
              <span className="installment-schedule__status">
                {item.paid ? 'Paid' : item.overdue ? 'Overdue' : 'Upcoming'}
              </span>
            )}
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
  const navigate = useNavigate();
  const query = useGetTransaction(id ?? '');
  const queryClient = useQueryClient();
  const { track } = useAnalytics();

  useEffect(() => {
    if (query.data) {
      track(ANALYTICS_EVENTS.TRANSACTION_VIEWED, { transactionId: id });
    }
  }, [query.data, id, track]);

  function patchCache(patch: (t: Transaction) => Transaction) {
    queryClient.setQueryData<Transaction>([TRANSACTIONS_QUERY_KEY, id], (old) =>
      old ? patch(old) : old
    );
    queryClient.setQueryData<Transaction[]>([TRANSACTIONS_QUERY_KEY], (old) =>
      old?.map((t) => (t.id === id ? patch(t) : t))
    );
  }

  function handlePayNow() {
    track(ANALYTICS_EVENTS.PAY_NOW_INITIATED, { transactionId: id });
    if (!window.confirm('Pay now using your default payment method?')) {
      track(ANALYTICS_EVENTS.PAY_NOW_CANCELLED, { transactionId: id });
      return;
    }
    track(ANALYTICS_EVENTS.PAY_NOW_CONFIRMED, { transactionId: id });
    patchCache((t) => ({ ...t, status: 'pending' as TransactionStatus }));
  }

  function handlePayInstallment() {
    track(ANALYTICS_EVENTS.PAY_NOW_INITIATED, { transactionId: id });
    if (!window.confirm('Pay now using your default payment method?')) {
      track(ANALYTICS_EVENTS.PAY_NOW_CANCELLED, { transactionId: id });
      return;
    }
    track(ANALYTICS_EVENTS.PAY_NOW_CONFIRMED, { transactionId: id });
    patchCache((t) => applyInstallmentPayment(t));
  }

  return (
    <>
      <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
      <QueryWrapper query={query} loadingMessage="Loading transaction">
        {(transaction) => (
          <>
            <h1>{transaction.merchantName}</h1>

            <div className="detail-hero">
              <span className="detail-hero__amount">{formatCurrency(transaction.totalAmount)}</span>
              <span
                className={`detail-hero__status detail-hero__status--${transaction.status}`}
                aria-live="polite"
                aria-atomic="true"
              >
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

            <InstallmentSchedule
              transaction={transaction}
              onPayInstallment={
                transaction.installmentPlan &&
                (transaction.status === 'active' || transaction.status === 'failed')
                  ? handlePayInstallment
                  : undefined
              }
            />

            {transaction.status === 'failed' && !transaction.installmentPlan && (
              <PayNowSection transaction={transaction} onPay={handlePayNow} />
            )}
          </>
        )}
      </QueryWrapper>
    </>
  );
}
