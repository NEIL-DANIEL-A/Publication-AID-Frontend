"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.updateRole = updateRole;
const zod_1 = require("zod");
const userService_1 = require("../services/userService");
const updateRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'admin'], {
        errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
    }),
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'User ID must be a valid UUID' }),
});
async function listUsers(_req, res) {
    try {
        const users = await (0, userService_1.listAllUsers)();
        res.json({
            success: true,
            data: users,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to list users';
        res.status(500).json({ success: false, error: message });
    }
}
async function updateRole(req, res) {
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
        const targetUser = await (0, userService_1.getUserById)(targetUserId);
        if (!targetUser) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        const updatedUser = await (0, userService_1.updateUserRole)(targetUserId, newRole);
        res.json({
            success: true,
            data: updatedUser,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update user role';
        res.status(500).json({ success: false, error: message });
    }
}
//# sourceMappingURL=adminController.js.map