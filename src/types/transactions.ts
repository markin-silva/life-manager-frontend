import type { Category } from './categories';

export type TransactionKind = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number | string;
  currency?: string;
  kind: TransactionKind;
  description: string;
  paid?: boolean;
  category: Category | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreateRequest {
  amount: number;
  currency?: string;
  kind: TransactionKind;
  description: string;
  category_id: string | null;
  occurred_at: string;
}

export type TransactionUpdateRequest = Partial<TransactionCreateRequest>;

export type TransactionPaginationMeta = {
  current_page: number;
  total_count: number;
  per_page: number;
};
