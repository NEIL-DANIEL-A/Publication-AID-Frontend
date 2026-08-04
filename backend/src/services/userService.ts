import { supabase } from './supabase';
import type { User, UserWithPasswordHash, UserRole } from '../types/user';

const TABLE = 'users';

export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  roll_number: string;
  password_hash: string;
}

/**
 * Strips password_hash from raw user record.
 */
function sanitizeUser(raw: Record<string, unknown>): User {
  const { password_hash, ...rest } = raw as Record<string, unknown>;
  return rest as unknown as User;
}

/**
 * Check if a username, email, or roll_number already exists.
 */
export async function checkDuplicates(
  username: string,
  email: string,
  roll_number: string
): Promise<{ exists: boolean; field?: string }> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('username, email, roll_number')
    .or(`username.eq.${username.trim()},email.eq.${email.trim().toLowerCase()},roll_number.eq.${roll_number.trim()}`);

  if (error) throw new Error(error.message);

  if (data && data.length > 0) {
    const matched = data[0];
    if (matched.username?.toLowerCase() === username.trim().toLowerCase()) {
      return { exists: true, field: 'username' };
    }
    if (matched.email?.toLowerCase() === email.trim().toLowerCase()) {
      return { exists: true, field: 'email' };
    }
    if (matched.roll_number?.toLowerCase() === roll_number.trim().toLowerCase()) {
      return { exists: true, field: 'roll_number' };
    }
    return { exists: true };
  }

  return { exists: false };
}

/**
 * Create a new user with forced role = 'user'.
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const { data: inserted, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name: data.name.trim(),
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        roll_number: data.roll_number.trim(),
        password_hash: data.password_hash,
        role: 'user', // strictly forced, never taken from input body
      },
    ])
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return sanitizeUser(inserted as Record<string, unknown>);
}

/**
 * Find user by email OR username (used for login).
 */
export async function findUserByIdentifier(identifier: string): Promise<UserWithPasswordHash | null> {
  const term = identifier.trim();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(`email.eq.${term.toLowerCase()},username.eq.${term}`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(error.message);
  }

  return data as unknown as UserWithPasswordHash;
}

/**
 * Get user by ID.
 */
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return sanitizeUser(data as Record<string, unknown>);
}

/**
 * List all users (admin only view).
 */
export async function listAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, username, email, roll_number, role, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data as Record<string, unknown>[]).map((u) => u as unknown as User);
}

/**
 * Promote or demote user role (admin only action).
 */
export async function updateUserRole(id: string, role: UserRole): Promise<User> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ role })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return sanitizeUser(data as Record<string, unknown>);
}
