"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("./middleware/logger");
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT ?? '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
// ── Security middleware ───────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiter: 200 req / 15 min per IP
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
}));
// ── General middleware ────────────────────────────────────────
app.use(express_1.default.json());
app.use(logger_1.requestLogger);
// ── Routes ───────────────────────────────────────────────────
app.use('/api', eventRoutes_1.default);
// 404 fallthrough
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.stack ?? err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
});
// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 OpportunityHub API running on http://localhost:${PORT}\x1b[0m`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map