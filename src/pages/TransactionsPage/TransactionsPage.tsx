import { useGetTransactions } from '../../queries/useGetTransactions';
import { QueryWrapper } from '../../components/QueryWrapper';
import { TransactionList } from './components/TransactionList';
import './TransactionsPage.scss';

export function TransactionsPage() {
  const query = useGetTransactions();

  return (
    <>
      <h1>Transactions</h1>
      <QueryWrapper query={query} loadingMessage="Loading transactions">
        {(data) => (
          <section className="transactions">
            <h2 className="transactions__count">
              {data.length === 0 ? 'No transactions' : `Showing ${data.length} transactions`}
            </h2>
            {data.length > 0 && <TransactionList transactions={data} />}
          </section>
        )}
      </QueryWrapper>
    </>
  );
}
