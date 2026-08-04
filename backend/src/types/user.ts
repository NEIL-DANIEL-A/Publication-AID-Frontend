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

export interface UserWithPasswordHash extends User {
  password_hash: string;
}
