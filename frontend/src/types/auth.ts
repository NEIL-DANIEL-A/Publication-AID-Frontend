export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roll_number: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface SignupCredentials {
  name: string;
  username: string;
  email: string;
  rollNumber: string;
  password: string;
}
