import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  checkDuplicates,
  createUser,
  findUserByIdentifier,
  getUserById,
} from '../services/userService';
import type { JwtPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-opportunityhub';
const TOKEN_EXPIRES_IN = '7d';

// ── Zod schemas ───────────────────────────────────────────────

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  rollNumber: z.string().min(2, 'Roll number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Helper to sign JWT
function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

// ── Controllers ───────────────────────────────────────────────

export async function signup(req: Request, res: Response): Promise<void> {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(', '),
    });
    return;
  }

  const { name, username, email, rollNumber, password } = parsed.data;

  try {
    // Check duplicates
    const dupCheck = await checkDuplicates(username, email, rollNumber);
    if (dupCheck.exists) {
      const fieldMsg = dupCheck.field ? `${dupCheck.field} is already taken` : 'User already exists';
      res.status(409).json({ success: false, error: fieldMsg });
      return;
    }

    // Hash password with bcrypt cost 10
    const password_hash = await bcrypt.hash(password, 10);

    // Create user (role forced to 'user' in userService)
    const user = await createUser({
      name,
      username,
      email,
      roll_number: rollNumber,
      password_hash,
    });

    // Issue JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signup failed';
    res.status(500).json({ success: false, error: message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(', '),
    });
    return;
  }

  const { identifier, password } = parsed.data;

  try {
    const userWithHash = await findUserByIdentifier(identifier);
    if (!userWithHash) {
      res.status(401).json({ success: false, error: 'Invalid email/username or password' });
      return;
    }

    // Compare bcrypt password
    const match = await bcrypt.compare(password, userWithHash.password_hash);
    if (!match) {
      res.status(401).json({ success: false, error: 'Invalid email/username or password' });
      return;
    }

    // Strip password_hash from response user object
    const { password_hash, ...user } = userWithHash;

    // Issue JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(500).json({ success: false, error: message });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user';
    res.status(500).json({ success: false, error: message });
  }
}
