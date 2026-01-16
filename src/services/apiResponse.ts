import axios, { AxiosError } from 'axios';

type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  error?: ApiError;
  message?: string;
};

export const getDataOrThrow = <T>(payload: ApiResponse<T>): T => {
  if (payload.status === 'success' && payload.data !== undefined) {
    return payload.data;
  }

  const message = payload.error?.message || 'Unexpected API error';
  throw new Error(message);
};

export const getSuccessMessage = <T>(payload: ApiResponse<T>): string | undefined => {
  if (payload.status !== 'success') return undefined;
  if (typeof payload.message === 'string') return payload.message;
  if (payload.data && typeof (payload.data as { message?: string }).message === 'string') {
    return (payload.data as { message?: string }).message;
  }
  return undefined;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown> | Record<string, unknown>>;
    const data = axiosError.response?.data as ApiResponse<unknown> | undefined;

    if (data?.status === 'error' && data.error?.message) {
      return data.error.message;
    }

    const legacyErrors = (axiosError.response?.data as { errors?: string[] })?.errors;
    if (Array.isArray(legacyErrors) && legacyErrors[0]) {
      return legacyErrors[0];
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error. Please try again.';
};

export const getErrorDetails = (error: unknown): Record<string, string[]> | undefined => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown> | Record<string, unknown>>;
    const data = axiosError.response?.data as ApiResponse<unknown> | undefined;
    if (data?.status === 'error' && data.error?.details) {
      return data.error.details as Record<string, string[]>;
    }
  }
  return undefined;
};

export const normalizeEmptyStrings = <T extends Record<string, unknown>>(payload: T): T => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (typeof value === 'string' && value.trim() === '') {
        return [key, null];
      }
      return [key, value];
    }),
  ) as T;
};

export type { ApiResponse };
