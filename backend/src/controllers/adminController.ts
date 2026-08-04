import { Request, Response } from 'express';
import { z } from 'zod';
import { listAllUsers, updateUserRole, getUserById } from '../services/userService';

const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
  }),
});

const idParamSchema = z.object({
  id: z.string().uuid({ message: 'User ID must be a valid UUID' }),
});

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await listAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list users';
    res.status(500).json({ success: false, error: message });
  }
}

export async function updateRole(req: Request, res: Response): Promise<void> {
  const paramParsed = idParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    res.status(400).json({
      success: false,
      error: paramParsed.error.errors[0]?.message ?? 'Invalid User ID',
    });
    return;
  }

  const bodyParsed = updateRoleSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({
      success: false,
      error: bodyParsed.error.errors.map((e) => e.message).join(', '),
    });
    return;
  }

  const targetUserId = paramParsed.data.id;
  const newRole = bodyParsed.data.role;

  try {
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const updatedUser = await updateUserRole(targetUserId, newRole);
    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update user role';
    res.status(500).json({ success: false, error: message });
  }
}
