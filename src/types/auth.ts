// API request/response types for authentication
export interface SignUpRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  status: string;
  data: {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
  };
}

export interface AuthHeaders {
  accessToken: string;
  client: string;
  uid: string;
}
