import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, LoginCredentials, SignupCredentials } from '../types/auth';
import { loginApi, signupApi, getMeApi } from '../services/api';

const TOKEN_KEY = 'opportunityhub_token';
const USER_KEY = 'opportunityhub_user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithToken: (token: string, user: User) => void;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAdmin = user?.role === 'admin';

  // Verify stored token on app start
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getMeApi();
        setUser(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      } catch {
        // Invalid or expired token
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  async function login(credentials: LoginCredentials) {
    const res = await loginApi(credentials);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  // Used by Google OAuth callback — token + user come from backend already verified
  function loginWithToken(appToken: string, appUser: User) {
    setToken(appToken);
    setUser(appUser);
    localStorage.setItem(TOKEN_KEY, appToken);
    localStorage.setItem(USER_KEY, JSON.stringify(appUser));
  }

  async function signup(credentials: SignupCredentials) {
    const res = await signupApi(credentials);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        login,
        loginWithToken,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
