export interface User {
  id: number;
  username: string;
  pin: string;
  role: 'admin' | 'user';
  name: string;
  email: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}