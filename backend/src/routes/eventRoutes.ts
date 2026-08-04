import { Router, Request, Response } from 'express';
import { listEvents, getEvent, getTypes } from '../controllers/eventController';
import { signup, login, me } from '../controllers/authController';
import { listUsers, updateRole } from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

// ── Public Endpoints ─────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/auth/signup', signup);
router.post('/auth/login', login);

// ── Protected Endpoints (Requires valid JWT) ──────────────────
router.get('/auth/me', requireAuth, me);
router.get('/events', requireAuth, listEvents);
router.get('/events/types', requireAuth, getTypes);
router.get('/events/:id', requireAuth, getEvent);

// ── Admin Endpoints (Requires valid JWT + admin role) ─────────
router.get('/admin/users', requireAuth, requireRole('admin'), listUsers);
router.patch('/admin/users/:id/role', requireAuth, requireRole('admin'), updateRole);

export default router;
