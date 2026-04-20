import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../api/transactionsApi';

export const TRANSACTIONS_QUERY_KEY = 'transactions';

export function useGetTransactions() {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY],
    queryFn: getTransactions,
  });
}
