import { Link } from 'react-router-dom';
import { useGetTransactions } from '../../queries/useGetTransactions';
import { QueryWrapper } from '../../components/QueryWrapper';
import { TransactionList } from '../TransactionsPage/components/TransactionList';
import { TransactionListItem } from '../TransactionsPage/components/TransactionListItem';
import { needsAttention, getAttentionReason, getRecentTransactions } from '../../utils/transactionUtils';
import './OverviewPage.scss';

export function OverviewPage() {
  const query = useGetTransactions();

  return (
    <>
      <h1>My Payments</h1>
      <QueryWrapper query={query} loadingMessage="Loading your payments">
        {(data) => {
          const PREVIEW_LIMIT = 5;
          const allAttention = data.filter(needsAttention);
          const recent = getRecentTransactions(
            data.filter((t) => !needsAttention(t)),
            PREVIEW_LIMIT
          );

          return (
            <>
              {allAttention.length > 0 && (
                <section className="overview__attention">
                  <h2>Needs attention</h2>
                  <ul className="transaction-list">
                    {allAttention.slice(0, PREVIEW_LIMIT).map((t) => (
                      <TransactionListItem
                        key={t.id}
                        transaction={t}
                        attentionReason={getAttentionReason(t) ?? undefined}
                      />
                    ))}
                  </ul>
                  {allAttention.length > PREVIEW_LIMIT && (
                    <Link to="/transactions" className="overview__show-all">
                      Show all {allAttention.length} transactions needing attention
                    </Link>
                  )}
                </section>
              )}
              <section className="overview__recent">
                <h2>Recent transactions</h2>
                <TransactionList transactions={recent} />
                <Link to="/transactions" className="overview__show-all">
                  Show all transactions
                </Link>
              </section>
            </>
          );
        }}
      </QueryWrapper>
    </>
  );
}
