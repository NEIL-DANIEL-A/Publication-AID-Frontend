import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './middleware/logger';
import { initializeDatabase } from './services/dbInit';
import eventRoutes from './routes/eventRoutes';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

// ── Security middleware ───────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiter: 200 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
  })
);

// ── General middleware ────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);

// ── Routes ───────────────────────────────────────────────────
app.use('/api', eventRoutes);

// 404 fallthrough
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.stack ?? err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
async function startServer() {
  // Auto-initialize DB schema if DATABASE_URL is provided in .env
  await initializeDatabase().catch((err) => {
    console.error('[DB INIT] Automatic database initialization failed:', err);
  });

  app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 OpportunityHub API running on http://localhost:${PORT}\x1b[0m`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

startServer();

export default app;
