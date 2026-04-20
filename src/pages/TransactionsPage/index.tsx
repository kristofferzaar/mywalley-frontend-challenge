import { useGetTransactions } from '../../queries/useGetTransactions';

export function TransactionsPage() {
  const { data, isLoading, isError } = useGetTransactions();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Can't load transactions</p>;
  }

  return (
    <>
      <h1>Transactions</h1>
      <ul>
        {data?.map((transaction) => (
          <li key={transaction.id}>{transaction.id}</li>
        ))}
      </ul>
    </>
  );
}
