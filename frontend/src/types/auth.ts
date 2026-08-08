export type UserRole = 'user' | 'admin';
export type AuthProvider = 'local' | 'google';
export type UserType = 'student' | 'faculty';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roll_number: string | null;
  auth_provider: AuthProvider;
  user_type: UserType | null;
  department: string | null;
  batch_year: number | null;
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
  identifier: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  username: string;
  email: string;
  rollNumber: string;
  password: string;
}
