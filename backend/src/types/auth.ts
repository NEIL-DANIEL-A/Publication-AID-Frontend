import type { UserRole, UserType } from './user';

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  user_type?: UserType | null;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
