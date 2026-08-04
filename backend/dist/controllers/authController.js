"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.me = me;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-opportunityhub';
const TOKEN_EXPIRES_IN = '7d';
// ── Zod schemas ───────────────────────────────────────────────
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    username: zod_1.z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: zod_1.z.string().email('Invalid email address'),
    rollNumber: zod_1.z.string().min(2, 'Roll number is required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1, 'Email or username is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Helper to sign JWT
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}
// ── Controllers ───────────────────────────────────────────────
async function signup(req, res) {
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
        const dupCheck = await (0, userService_1.checkDuplicates)(username, email, rollNumber);
        if (dupCheck.exists) {
            const fieldMsg = dupCheck.field ? `${dupCheck.field} is already taken` : 'User already exists';
            res.status(409).json({ success: false, error: fieldMsg });
            return;
        }
        // Hash password with bcrypt cost 10
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        // Create user (role forced to 'user' in userService)
        const user = await (0, userService_1.createUser)({
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        res.status(500).json({ success: false, error: message });
    }
}
async function login(req, res) {
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
        const userWithHash = await (0, userService_1.findUserByIdentifier)(identifier);
        if (!userWithHash) {
            res.status(401).json({ success: false, error: 'Invalid email/username or password' });
            return;
        }
        // Compare bcrypt password
        const match = await bcryptjs_1.default.compare(password, userWithHash.password_hash);
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        res.status(500).json({ success: false, error: message });
    }
}
async function me(req, res) {
    if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    try {
        const user = await (0, userService_1.getUserById)(req.user.id);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.json({
            success: true,
            user,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch user';
        res.status(500).json({ success: false, error: message });
    }
}
//# sourceMappingURL=authController.js.map