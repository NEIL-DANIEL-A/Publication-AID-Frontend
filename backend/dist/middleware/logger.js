"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
/**
 * Simple request logger — method, path, status, duration.
 * Replaces morgan for minimal footprint; swap in morgan if you prefer.
 */
function requestLogger(req, res, next) {
    const start = Date.now();
    const { method, originalUrl } = req;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const color = status >= 500 ? '\x1b[31m' : // red
            status >= 400 ? '\x1b[33m' : // yellow
                status >= 300 ? '\x1b[36m' : // cyan
                    '\x1b[32m'; // green
        console.log(`${color}${method}\x1b[0m ${originalUrl} → ${color}${status}\x1b[0m (${duration}ms)`);
    });
    next();
}
//# sourceMappingURL=logger.js.map