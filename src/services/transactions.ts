import apiClient from './api';
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
} from '../types/transactions';

type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  error?: ApiError;
};

const ensureSuccess = <T>(response: ApiResponse<T>): T => {
  if (response.status === 'success' && response.data !== undefined) {
    return response.data;
  }

  const message = response.error?.message || 'Unexpected API error';
  throw new Error(message);
};

const unwrapList = (data: Transaction[] | { transactions: Transaction[] }): Transaction[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if ('transactions' in data && Array.isArray(data.transactions)) {
    return data.transactions;
  }

  return [];
};

const unwrapItem = (data: Transaction | { transaction: Transaction }): Transaction => {
  if ('transaction' in data) {
    return data.transaction;
  }

  return data;
};

export const transactionsService = {
  async list(): Promise<Transaction[]> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(
      '/api/v1/transactions',
    );
    const data = ensureSuccess(response.data);
    return unwrapList(data as Transaction[] | { transactions: Transaction[] });
  },

  async get(id: string): Promise<Transaction> {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      `/api/v1/transactions/${id}`,
    );
    const data = ensureSuccess(response.data);
    return unwrapItem(data as Transaction | { transaction: Transaction });
  },

  async create(payload: TransactionCreateRequest): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      '/api/v1/transactions',
      payload,
    );
    const data = ensureSuccess(response.data);
    return unwrapItem(data as Transaction | { transaction: Transaction });
  },

  async update(
    id: string,
    payload: TransactionUpdateRequest,
  ): Promise<Transaction> {
    const response = await apiClient.put<ApiResponse<Transaction>>(
      `/api/v1/transactions/${id}`,
      payload,
    );
    const data = ensureSuccess(response.data);
    return unwrapItem(data as Transaction | { transaction: Transaction });
  },

  async remove(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/api/v1/transactions/${id}`,
    );
    ensureSuccess(response.data);
  },
};
