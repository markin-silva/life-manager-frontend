export type TransactionKind = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  kind: TransactionKind;
  description: string;
  category: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreateRequest {
  amount: number;
  kind: TransactionKind;
  description: string;
  category: string;
  occurred_at: string;
}

export type TransactionUpdateRequest = Partial<TransactionCreateRequest>;
