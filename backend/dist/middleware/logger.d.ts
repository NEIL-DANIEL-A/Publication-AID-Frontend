import { Request, Response, NextFunction } from 'express';
/**
 * Simple request logger — method, path, status, duration.
 * Replaces morgan for minimal footprint; swap in morgan if you prefer.
 */
export declare function requestLogger(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=logger.d.ts.map