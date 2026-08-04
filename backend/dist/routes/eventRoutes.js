"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const authController_1 = require("../controllers/authController");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// ── Public Endpoints ─────────────────────────────────────────
router.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});
router.post('/auth/signup', authController_1.signup);
router.post('/auth/login', authController_1.login);
// ── Protected Endpoints (Requires valid JWT) ──────────────────
router.get('/auth/me', authMiddleware_1.requireAuth, authController_1.me);
router.get('/events', authMiddleware_1.requireAuth, eventController_1.listEvents);
router.get('/events/types', authMiddleware_1.requireAuth, eventController_1.getTypes);
router.get('/events/:id', authMiddleware_1.requireAuth, eventController_1.getEvent);
// ── Admin Endpoints (Requires valid JWT + admin role) ─────────
router.get('/admin/users', authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)('admin'), adminController_1.listUsers);
router.patch('/admin/users/:id/role', authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)('admin'), adminController_1.updateRole);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map