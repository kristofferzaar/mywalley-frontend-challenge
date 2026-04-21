import { request } from './request';
import type { Transaction, TransactionsData } from '../types/transaction';

export async function getTransactions(): Promise<Transaction[]> {
  const data = await request<TransactionsData>('/transactions.json');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return data.transactions;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const transactions = await getTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    throw new Error(`Transaction not found: ${id}`);
  }

  // Fake error from XXL
  if (transaction.id === 'txn_019') {
    throw new Error('Testing error handling');
  }

  return transaction;
}
