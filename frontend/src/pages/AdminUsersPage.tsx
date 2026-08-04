import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { User, UserRole } from '../types/auth';
import { fetchAdminUsers, updateUserRoleApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetchAdminUsers();
        setUsers(res.data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load users';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  async function handleRoleChange(targetUserId: string, newRole: UserRole) {
    if (targetUserId === currentUser?.id) {
      if (!window.confirm('Are you sure you want to change your own admin role? You may lose access.')) {
        return;
      }
    }

    setUpdatingId(targetUserId);
    try {
      const res = await updateUserRoleApi(targetUserId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: res.data.role } : u))
      );
      toast.success(`Role updated to ${newRole} for ${res.data.name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update user role';
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mb-2">
            Admin Panel
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            User Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Review registered accounts and manage administrative access permissions
          </p>
        </div>
        <div className="text-xs font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
          Total Users: {users.length}
        </div>
      </motion.div>

      {/* Users table */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-2 border-accent-600 border-t-transparent animate-spin mb-2" />
          <p className="text-sm text-neutral-500">Loading user accounts…</p>
        </div>
      ) : users.length === 0 ? (
        <div className="glass-card p-12 text-center text-neutral-500">
          No users found.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300">
              <thead className="bg-neutral-100/70 dark:bg-neutral-800/70 text-neutral-500 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-200/50 dark:border-neutral-700/50">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Roll Number</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{u.name}</p>
                          <p className="text-[11px] text-neutral-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-neutral-600 dark:text-neutral-400">{u.roll_number}</td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400">{u.email}</td>
                    <td className="px-5 py-4 text-neutral-500">
                      {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          disabled={updatingId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className={`select-glass py-1 px-2.5 text-xs font-semibold rounded-lg border shadow-none ${
                            u.role === 'admin'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {updatingId === u.id && (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-accent-600 border-t-transparent animate-spin" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
