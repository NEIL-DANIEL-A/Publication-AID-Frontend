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
const isDev = (process.env.NODE_ENV ?? 'development') === 'development';

// Build the allowed-origins list from env
const allowedOrigins = CORS_ORIGIN.split(',').map((o) => o.trim());

// Matches any ngrok-free.app subdomain (https://xxxx.ngrok-free.app)
const NGROK_ORIGIN_RE = /^https:\/\/[a-z0-9-]+\.ngrok-free\.app$/;

// ── Security middleware ───────────────────────────────────────
// Disable Helmet's Cross-Origin-Resource-Policy header so the browser
// does not block cross-origin API responses (it conflicts with CORS).
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    // In development allow ANY localhost port (5173, 5174, etc.).
    // In production only the exact origins listed in CORS_ORIGIN are permitted.
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser (curl / Postman)
      // Allow any localhost port in dev
      if (isDev && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Always allow ngrok tunnels
      if (NGROK_ORIGIN_RE.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[36m🚀 OpportunityHub API running on http://localhost:${PORT}\x1b[0m`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`   CORS origins: ${allowedOrigins.join(', ')} + any *.ngrok-free.app`);
  });
}

startServer();

export default app;
