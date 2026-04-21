import type { Transaction } from '../../../types/transaction';
import { TransactionListItem } from './TransactionListItem';
import './TransactionList.scss';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionListItem key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  );
}
