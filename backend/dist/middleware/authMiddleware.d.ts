import { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types/user';
/**
 * Middleware: require valid JWT in Authorization header
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
/**
 * Middleware: require specific role (must run after requireAuth)
 */
export declare function requireRole(role: UserRole): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map