import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { SignUpRequest, AuthResponse, AuthHeaders } from '../types/auth';

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

  if (accessToken && client && uid) {
    config.headers['access-token'] = accessToken;
    config.headers['client'] = client;
    config.headers['uid'] = uid;
  }

  return config;
});

export const authService = {
  async signup(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth', data);
      
      // Extract auth headers from response
      const accessToken = response.headers['access-token'];
      const client = response.headers['client'];
      const uid = response.headers['uid'];

      // Store auth tokens
      if (accessToken && client && uid) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('client', client);
        localStorage.setItem('uid', uid);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
  },

  getAuthHeaders(): AuthHeaders | null {
    const accessToken = localStorage.getItem('accessToken');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    if (accessToken && client && uid) {
      return { accessToken, client, uid };
    }

    return null;
  },

  isAuthenticated(): boolean {
    return this.getAuthHeaders() !== null;
  },
};

export default apiClient;
