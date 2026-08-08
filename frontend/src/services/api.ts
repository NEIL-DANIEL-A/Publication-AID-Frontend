/// <reference types="vite/client" />
import axios from 'axios';
import toast from 'react-hot-toast';
import type { FilterState, PaginatedResponse, SingleResponse, EventTypeCount } from '../types/event';
import type { AuthResponse, LoginCredentials, SignupCredentials, User, UserRole } from '../types/auth';

const TOKEN_KEY = 'opportunityhub_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response Interceptor: Handle 401 & 403 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.error ??
      err.message ??
      'An unexpected error occurred';

    if (status === 401) {
      // Don't auto-redirect if we are already on login or signup
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
      if (!isAuthPage) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('opportunityhub_user');
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    } else if (status === 403) {
      toast.error('Access forbidden: Admins only');
    }

    return Promise.reject(new Error(message));
  }
);

// ── Auth Endpoints ───────────────────────────────────────────
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
}

export async function signupApi(credentials: SignupCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', credentials);
  return data;
}

export async function googleAuthApi(supabaseAccessToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/google', { supabaseAccessToken });
  return data;
}

export async function getMeApi(): Promise<{ success: boolean; user: User }> {
  const { data } = await api.get<{ success: boolean; user: User }>('/auth/me');
  return data;
}

// ── Events Endpoints ─────────────────────────────────────────
export async function fetchEvents(filters: Partial<FilterState> & { limit?: number }): Promise<PaginatedResponse> {
  const params: Record<string, string | number | boolean> = {};

  if (filters.search)      params.search      = filters.search;
  if (filters.type)        params.type        = filters.type;
  if (filters.platform)    params.platform    = filters.platform;
  if (filters.mode)        params.mode        = filters.mode;
  if (filters.fee)         params.fee         = filters.fee;
  if (filters.eligibility) params.eligibility = filters.eligibility;
  if (filters.upcoming)    params.upcoming    = true;
  if (filters.sort)        params.sort        = filters.sort;
  if (filters.page)        params.page        = filters.page;
  if (filters.limit)       params.limit       = filters.limit;

  const { data } = await api.get<PaginatedResponse>('/events', { params });
  return data;
}

export async function fetchEventById(id: string): Promise<SingleResponse> {
  const { data } = await api.get<SingleResponse>(`/events/${id}`);
  return data;
}

export async function fetchEventTypes(): Promise<{ success: boolean; data: EventTypeCount[] }> {
  const { data } = await api.get<{ success: boolean; data: EventTypeCount[] }>('/events/types');
  return data;
}

// ── Admin Endpoints ──────────────────────────────────────────
export async function fetchAdminUsers(): Promise<{ success: boolean; data: User[] }> {
  const { data } = await api.get<{ success: boolean; data: User[] }>('/admin/users');
  return data;
}

export async function updateUserRoleApi(userId: string, role: UserRole): Promise<{ success: boolean; data: User }> {
  const { data } = await api.patch<{ success: boolean; data: User }>(`/admin/users/${userId}/role`, { role });
  return data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
}

export default api;
