import { request } from './request';
import type { Transaction, TransactionsData } from '../types/transaction';

// Demo: keep a few transactions perpetually recent so the relative timestamp UI ("Today", "Yesterday",
// "3 days ago") is always visible when reviewing the app. Static JSON dates would go stale.
const DEMO_RECENT: Record<string, number> = {
  txn_003: 0, // today
  txn_005: 1, // yesterday
  txn_010: 3, // 3 days ago
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function getTransactions(): Promise<Transaction[]> {
  const data = await request<TransactionsData>('/transactions.json');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return data.transactions.map((t) =>
    t.id in DEMO_RECENT ? { ...t, purchaseDate: daysAgo(DEMO_RECENT[t.id]!) } : t
  );
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
