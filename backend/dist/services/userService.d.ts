import type { User, UserWithPasswordHash, UserRole } from '../types/user';
export interface CreateUserData {
    name: string;
    username: string;
    email: string;
    roll_number: string;
    password_hash: string;
}
/**
 * Check if a username, email, or roll_number already exists.
 */
export declare function checkDuplicates(username: string, email: string, roll_number: string): Promise<{
    exists: boolean;
    field?: string;
}>;
/**
 * Create a new user with forced role = 'user'.
 */
export declare function createUser(data: CreateUserData): Promise<User>;
/**
 * Find user by email OR username (used for login).
 */
export declare function findUserByIdentifier(identifier: string): Promise<UserWithPasswordHash | null>;
/**
 * Get user by ID.
 */
export declare function getUserById(id: string): Promise<User | null>;
/**
 * List all users (admin only view).
 */
export declare function listAllUsers(): Promise<User[]>;
/**
 * Promote or demote user role (admin only action).
 */
export declare function updateUserRole(id: string, role: UserRole): Promise<User>;
//# sourceMappingURL=userService.d.ts.map