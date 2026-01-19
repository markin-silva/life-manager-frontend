import apiClient from './api';
import type { ApiResponse } from './apiResponse';
import { getDataOrThrow, getErrorMessage, getSuccessMessage } from './apiResponse';
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionPaginationMeta,
} from '../types/transactions';

const ensureSuccess = <T>(response: ApiResponse<T>): T => getDataOrThrow(response);

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

type PaginatedMeta = TransactionPaginationMeta;

export const transactionsService = {
  async list(page = 1, perPage = 30): Promise<{ transactions: Transaction[]; meta?: PaginatedMeta }> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction[]> & { meta?: PaginatedMeta }>(
        '/api/v1/transactions',
        { params: { page, per_page: perPage } },
      );
      const data = ensureSuccess(response.data);
      return {
        transactions: unwrapList(data as Transaction[] | { transactions: Transaction[] }),
        meta: response.data.meta,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async get(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction>>(
        `/api/v1/transactions/${id}`,
      );
      const data = ensureSuccess(response.data);
      return unwrapItem(data as Transaction | { transaction: Transaction });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload: TransactionCreateRequest): Promise<{ transaction: Transaction; message?: string }> {
    try {
      const response = await apiClient.post<ApiResponse<Transaction>>(
        '/api/v1/transactions',
        payload,
      );
      const message = getSuccessMessage(response.data);
      const data = ensureSuccess(response.data);
      return { transaction: unwrapItem(data as Transaction | { transaction: Transaction }), message };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(
    id: string,
    payload: TransactionUpdateRequest,
  ): Promise<Transaction> {
    try {
      const response = await apiClient.put<ApiResponse<Transaction>>(
        `/api/v1/transactions/${id}`,
        payload,
      );
      const data = ensureSuccess(response.data);
      return unwrapItem(data as Transaction | { transaction: Transaction });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/api/v1/transactions/${id}`,
      );
      ensureSuccess(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
