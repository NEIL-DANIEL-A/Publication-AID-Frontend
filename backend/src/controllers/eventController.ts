import { Request, Response } from 'express';
import { z } from 'zod';
import { getEvents, getEventById, getEventTypeCounts } from '../services/eventService';
import type { SortOption } from '../types/event';

const ALLOWED_TYPES = ['Hackathon', 'Workshop', 'Conference', 'Competition'];

// ── Zod schemas ───────────────────────────────────────────────

const listQuerySchema = z.object({
  search: z.string().optional(),
  type: z
    .string()
    .optional()
    .refine((v) => {
      if (!v) return true;
      const parts = v.split(',').map((p) => p.trim());
      return parts.every((p) => ALLOWED_TYPES.includes(p));
    }, { message: 'Invalid event type. Allowed values: Hackathon, Workshop, Conference, Competition' }),
  platform:    z.string().optional(),
  mode:        z.enum(['Online', 'Offline', 'Hybrid']).optional(),
  fee:         z.enum(['Free', 'Paid']).optional(),
  eligibility: z.string().optional(),
  upcoming:    z.string().optional().transform((v) => v === 'true'),
  sort:        z
    .enum(['deadline_asc', 'deadline_desc', 'newest', 'oldest'])
    .optional()
    .default('deadline_asc'),
  page:  z.string().optional().transform((v) => Math.max(1, parseInt(v ?? '1', 10))),
  limit: z.string().optional().transform((v) => {
    const n = parseInt(v ?? '12', 10);
    return Math.min(Math.max(1, n), 100); // clamp 1–100
  }),
});

const idParamSchema = z.object({
  id: z.string().uuid({ message: 'Event ID must be a valid UUID' }),
});

// ── Controllers ───────────────────────────────────────────────

export async function listEvents(req: Request, res: Response): Promise<void> {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(', '),
    });
    return;
  }

  try {
    const result = await getEvents({
      ...parsed.data,
      sort: parsed.data.sort as SortOption,
    });
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: message });
  }
}

export async function getEvent(req: Request, res: Response): Promise<void> {
  const parsed = idParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid ID',
    });
    return;
  }

  try {
    const event = await getEventById(parsed.data.id);
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json({ success: true, data: event });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ success: false, error: message });
  }
}

export async function getTypes(_req: Request, res: Response): Promise<void> {
  try {
    const types = await getEventTypeCounts();
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json({ success: true, data: types });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch event types';
    res.status(500).json({ success: false, error: message });
  }
}
