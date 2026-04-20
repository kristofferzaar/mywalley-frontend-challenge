import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../api/transactionsApi';
import { TRANSACTIONS_QUERY_KEY } from './useGetTransactions';

export function useGetTransaction(id: string) {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, id],
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });
}
