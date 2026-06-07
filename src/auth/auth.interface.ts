export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token?: string;
  expires_in?: string;
  refresh_token?: string;
  user: {
    id: number;
    email: string;
  };
}
