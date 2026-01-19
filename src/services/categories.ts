import apiClient from './api';
import type { ApiResponse } from './apiResponse';
import { getDataOrThrow, getErrorMessage } from './apiResponse';
import type { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../types/categories';

const ensureSuccess = <T>(response: ApiResponse<T>): T => getDataOrThrow(response);

const unwrapList = (data: Category[] | { categories: Category[] }): Category[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if ('categories' in data && Array.isArray(data.categories)) {
    return data.categories;
  }

  return [];
};

const unwrapItem = (data: Category | { category: Category }): Category => {
  if ('category' in data) {
    return data.category;
  }

  return data;
};

export const categoriesService = {
  async list(): Promise<Category[]> {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/categories');
      const data = ensureSuccess(response.data);
      return unwrapList(data as Category[] | { categories: Category[] });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async create(payload: CategoryCreateRequest): Promise<Category> {
    try {
      const response = await apiClient.post<ApiResponse<Category>>('/api/v1/categories', {
        category: payload,
      });
      const data = ensureSuccess(response.data);
      return unwrapItem(data as Category | { category: Category });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id: string, payload: CategoryUpdateRequest): Promise<Category> {
    try {
      const response = await apiClient.put<ApiResponse<Category>>(`/api/v1/categories/${id}`, {
        category: payload,
      });
      const data = ensureSuccess(response.data);
      return unwrapItem(data as Category | { category: Category });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/categories/${id}`);
      ensureSuccess(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
