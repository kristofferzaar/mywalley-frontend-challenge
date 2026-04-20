import { useParams } from 'react-router-dom';
import { useGetTransaction } from '../../queries/useGetTransaction';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetTransaction(id ?? '');

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Can't load transaction</p>;
  }

  return (
    <>
      <h1>{data?.merchantName}</h1>
    </>
  );
}
