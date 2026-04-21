import { useGetTransactions } from '../../queries/useGetTransactions';
import { QueryWrapper } from '../../components/QueryWrapper';
import { TransactionList } from './components/TransactionList';

export function TransactionsPage() {
  const query = useGetTransactions();

  return (
    <>
      <h1>Transactions</h1>
      <QueryWrapper query={query} loadingMessage="Loading transactions">
        {(data) =>
          data.length === 0 ? <p>No transactions yet.</p> : <TransactionList transactions={data} />
        }
      </QueryWrapper>
    </>
  );
}
