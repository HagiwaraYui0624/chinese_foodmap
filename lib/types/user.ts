export interface User {
  id: string;
  email: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  nickname?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 