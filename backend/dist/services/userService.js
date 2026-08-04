"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicates = checkDuplicates;
exports.createUser = createUser;
exports.findUserByIdentifier = findUserByIdentifier;
exports.getUserById = getUserById;
exports.listAllUsers = listAllUsers;
exports.updateUserRole = updateUserRole;
const supabase_1 = require("./supabase");
const TABLE = 'users';
/**
 * Strips password_hash from raw user record.
 */
function sanitizeUser(raw) {
    const { password_hash, ...rest } = raw;
    return rest;
}
/**
 * Check if a username, email, or roll_number already exists.
 */
async function checkDuplicates(username, email, roll_number) {
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .select('username, email, roll_number')
        .or(`username.eq.${username.trim()},email.eq.${email.trim().toLowerCase()},roll_number.eq.${roll_number.trim()}`);
    if (error)
        throw new Error(error.message);
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
async function createUser(data) {
    const { data: inserted, error } = await supabase_1.supabase
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
    if (error)
        throw new Error(error.message);
    return sanitizeUser(inserted);
}
/**
 * Find user by email OR username (used for login).
 */
async function findUserByIdentifier(identifier) {
    const term = identifier.trim();
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .select('*')
        .or(`email.eq.${term.toLowerCase()},username.eq.${term}`)
        .single();
    if (error) {
        if (error.code === 'PGRST116')
            return null; // not found
        throw new Error(error.message);
    }
    return data;
}
/**
 * Get user by ID.
 */
async function getUserById(id) {
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        if (error.code === 'PGRST116')
            return null;
        throw new Error(error.message);
    }
    return sanitizeUser(data);
}
/**
 * List all users (admin only view).
 */
async function listAllUsers() {
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .select('id, name, username, email, roll_number, role, created_at, updated_at')
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map((u) => u);
}
/**
 * Promote or demote user role (admin only action).
 */
async function updateUserRole(id, role) {
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .update({ role })
        .eq('id', id)
        .select('*')
        .single();
    if (error)
        throw new Error(error.message);
    return sanitizeUser(data);
}
//# sourceMappingURL=userService.js.map