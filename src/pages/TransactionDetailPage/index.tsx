import { useParams } from 'react-router-dom';
import { useGetTransaction } from '../../queries/useGetTransaction';
import { QueryWrapper } from '../../components/QueryWrapper';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useGetTransaction(id ?? '');

  return (
    <QueryWrapper query={query} loadingMessage="Loading transaction">
      {(data) => <h1>{data.merchantName}</h1>}
    </QueryWrapper>
  );
}
