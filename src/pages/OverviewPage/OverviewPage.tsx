import { Link } from 'react-router-dom';
import { useGetTransactions } from '../../queries/useGetTransactions';
import { QueryWrapper } from '../../components/QueryWrapper';
import { TransactionList } from '../TransactionsPage/components/TransactionList';
import { TransactionListItem } from '../TransactionsPage/components/TransactionListItem';
import { needsAttention, getAttentionReason, getRecentTransactions } from '../../utils/transactionUtils';
import './OverviewPage.scss';

const PREVIEW_LIMIT = 5;

export function OverviewPage() {
  const query = useGetTransactions();

  return (
    <>
      <h1>My Payments</h1>
      <QueryWrapper query={query} loadingMessage="Loading your payments">
        {(data) => {
          const allAttention = data.filter(needsAttention);
          const recent = getRecentTransactions(
            data.filter((t) => !needsAttention(t)),
            PREVIEW_LIMIT
          );

          return (
            <>
              {allAttention.length > 0 && (
                <section className="overview__attention">
                  <h2 className="overview__section-heading">Needs attention</h2>
                  <ul className="transaction-list">
                    {allAttention.map((t) => (
                      <TransactionListItem
                        key={t.id}
                        transaction={t}
                        attentionReason={getAttentionReason(t) ?? undefined}
                      />
                    ))}
                  </ul>
                </section>
              )}
              <section className="overview__recent">
                <div className="overview__section-header">
                  <h2>Recent transactions</h2>
                  <Link to="/transactions" className="overview__section-link" aria-label="See all recent transactions">See all</Link>
                </div>
                <TransactionList transactions={recent} />
              </section>
            </>
          );
        }}
      </QueryWrapper>
    </>
  );
}
