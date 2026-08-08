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

export interface UserWithPasswordHash extends User {
  password_hash: string | null;
}
