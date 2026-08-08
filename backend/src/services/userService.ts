import { supabase } from './supabase';
import type { User, UserWithPasswordHash, UserRole, UserType } from '../types/user';

const TABLE = 'users';

export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  roll_number: string;
  password_hash: string;
}

export interface GoogleUserData {
  name: string;
  email: string;
  userType: UserType;
  department: string | null;
  batchYear: number | null;
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
    if (matched.roll_number && matched.roll_number.toLowerCase() === roll_number.trim().toLowerCase()) {
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
        auth_provider: 'local',
        role: 'user', // strictly forced
      },
    ])
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return sanitizeUser(inserted as Record<string, unknown>);
}

/**
 * Generate unique username based on local-part of email.
 */
async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let candidate = baseUsername.toLowerCase().replace(/[^a-z0-9_.]/g, '_');
  let counter = 0;

  while (true) {
    const checkName = counter === 0 ? candidate : `${candidate}${counter}`;
    const { data } = await supabase
      .from(TABLE)
      .select('id')
      .eq('username', checkName)
      .maybeSingle();

    if (!data) {
      return checkName;
    }
    counter++;
  }
}

/**
 * Find or create a user via Google OAuth sign-in.
 */
export async function findOrCreateGoogleUser(data: GoogleUserData): Promise<User> {
  const cleanEmail = data.email.trim().toLowerCase();

  // 1. Check if user with this email already exists
  const { data: existing, error: searchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (searchError) throw new Error(searchError.message);

  if (existing) {
    // User exists -> Update Google auth metadata
    const { data: updated, error: updateError } = await supabase
      .from(TABLE)
      .update({
        auth_provider: 'google',
        user_type: data.userType,
        department: data.department,
        batch_year: data.batchYear,
        name: data.name.trim() || existing.name,
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (updateError) throw new Error(updateError.message);
    return sanitizeUser(updated as Record<string, unknown>);
  }

  // 2. User does not exist -> Create new Google user
  const localPart = cleanEmail.split('@')[0];
  const uniqueUsername = await generateUniqueUsername(localPart);

  const { data: inserted, error: insertError } = await supabase
    .from(TABLE)
    .insert([
      {
        name: data.name.trim() || localPart,
        username: uniqueUsername,
        email: cleanEmail,
        roll_number: null,
        password_hash: null,
        auth_provider: 'google',
        user_type: data.userType,
        department: data.department,
        batch_year: data.batchYear,
        role: 'user', // strictly forced
      },
    ])
    .select('*')
    .single();

  if (insertError) throw new Error(insertError.message);

  return sanitizeUser(inserted as Record<string, unknown>);
}

/**
 * Find user by email OR username (used for local login).
 */
export async function findUserByIdentifier(identifier: string): Promise<UserWithPasswordHash | null> {
  const term = identifier.trim();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(`email.eq.${term.toLowerCase()},username.eq.${term}`)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

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
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return sanitizeUser(data as Record<string, unknown>);
}

/**
 * List all users (admin only view).
 */
export async function listAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, username, email, roll_number, auth_provider, user_type, department, batch_year, role, created_at, updated_at')
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
