"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = listEvents;
exports.getEvent = getEvent;
exports.getTypes = getTypes;
const zod_1 = require("zod");
const eventService_1 = require("../services/eventService");
const ALLOWED_TYPES = ['Hackathon', 'Workshop', 'Conference', 'Competition'];
// ── Zod schemas ───────────────────────────────────────────────
const listQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    type: zod_1.z
        .string()
        .optional()
        .refine((v) => {
        if (!v)
            return true;
        const parts = v.split(',').map((p) => p.trim());
        return parts.every((p) => ALLOWED_TYPES.includes(p));
    }, { message: 'Invalid event type. Allowed values: Hackathon, Workshop, Conference, Competition' }),
    platform: zod_1.z.string().optional(),
    mode: zod_1.z.enum(['Online', 'Offline', 'Hybrid']).optional(),
    fee: zod_1.z.enum(['Free', 'Paid']).optional(),
    eligibility: zod_1.z.string().optional(),
    upcoming: zod_1.z.string().optional().transform((v) => v === 'true'),
    sort: zod_1.z
        .enum(['deadline_asc', 'deadline_desc', 'newest', 'oldest'])
        .optional()
        .default('deadline_asc'),
    page: zod_1.z.string().optional().transform((v) => Math.max(1, parseInt(v ?? '1', 10))),
    limit: zod_1.z.string().optional().transform((v) => {
        const n = parseInt(v ?? '12', 10);
        return Math.min(Math.max(1, n), 100); // clamp 1–100
    }),
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'Event ID must be a valid UUID' }),
});
// ── Controllers ───────────────────────────────────────────────
async function listEvents(req, res) {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        res.status(400).json({
            success: false,
            error: parsed.error.errors.map((e) => e.message).join(', '),
        });
        return;
    }
    try {
        const result = await (0, eventService_1.getEvents)({
            ...parsed.data,
            sort: parsed.data.sort,
        });
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        res.json(result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        res.status(500).json({ success: false, error: message });
    }
}
async function getEvent(req, res) {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({
            success: false,
            error: parsed.error.errors[0]?.message ?? 'Invalid ID',
        });
        return;
    }
    try {
        const event = await (0, eventService_1.getEventById)(parsed.data.id);
        if (!event) {
            res.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        res.json({ success: true, data: event });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        res.status(500).json({ success: false, error: message });
    }
}
async function getTypes(_req, res) {
    try {
        const types = await (0, eventService_1.getEventTypeCounts)();
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        res.json({ success: true, data: types });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch event types';
        res.status(500).json({ success: false, error: message });
    }
}
//# sourceMappingURL=eventController.js.map