import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { SignUpRequest, LoginRequest, AuthResponse, AuthHeaders } from '../types/auth';
import { getErrorMessage } from './apiResponse';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add stored auth tokens to requests
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  const client = localStorage.getItem('client');
  const uid = localStorage.getItem('uid');
  const expiry = localStorage.getItem('expiry');
  const tokenType = localStorage.getItem('tokenType');
  const locale = localStorage.getItem('locale') || 'en';

  if (accessToken && client && uid) {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('access-token', accessToken);
      config.headers.set('client', client);
      config.headers.set('uid', uid);
      if (expiry) config.headers.set('expiry', expiry);
      if (tokenType) config.headers.set('token-type', tokenType);
    } else {
      config.headers = config.headers || {};
      config.headers['access-token'] = accessToken;
      config.headers['client'] = client;
      config.headers['uid'] = uid;
      if (expiry) config.headers['expiry'] = expiry;
      if (tokenType) config.headers['token-type'] = tokenType;
    }
  }

  if (typeof config.headers?.set === 'function') {
    config.headers.set('Accept-Language', locale);
  } else {
    config.headers = config.headers || {};
    config.headers['Accept-Language'] = locale;
  }

  return config;
});

const storeAuthHeaders = (headers: Record<string, string | undefined>) => {
  const accessToken = headers['access-token'];
  const client = headers['client'];
  const uid = headers['uid'];
  const expiry = headers['expiry'];
  const tokenType = headers['token-type'];

  if (accessToken && client && uid) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('client', client);
    localStorage.setItem('uid', uid);

    if (expiry) {
      localStorage.setItem('expiry', expiry);
    }

    if (tokenType) {
      localStorage.setItem('tokenType', tokenType);
    }
  }
};

apiClient.interceptors.response.use(
  (response) => {
    storeAuthHeaders(response.headers as Record<string, string | undefined>);
    return response;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  async signup(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth', data);
      
      storeAuthHeaders(response.headers as Record<string, string | undefined>);

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth/sign_in', data);
      storeAuthHeaders(response.headers as Record<string, string | undefined>);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
    localStorage.removeItem('expiry');
    localStorage.removeItem('tokenType');
  },

  getAuthHeaders(): AuthHeaders | null {
    const accessToken = localStorage.getItem('accessToken');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');
    const expiry = localStorage.getItem('expiry');
    const tokenType = localStorage.getItem('tokenType');

    if (accessToken && client && uid) {
      return { accessToken, client, uid, expiry: expiry || undefined, tokenType: tokenType || undefined };
    }

    return null;
  },

  isAuthenticated(): boolean {
    return this.getAuthHeaders() !== null;
  },
};

export default apiClient;
