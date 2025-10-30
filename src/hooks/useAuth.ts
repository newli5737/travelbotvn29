import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthUser } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

const ADMIN_ACCOUNT = {
  email: 'admin@example.com',
  password: 'password123',
};

const ADMIN_USER: AuthUser = {
  id: 'admin-001',
  email: 'admin@example.com',
  name: 'Admin',
  role: 'admin',
  created_at: new Date().toISOString(),
};

const ADMIN_TOKEN = 'admin-token-12345';

export const useAuth = () => {
  const store = useAuthStore();

  // Initialize from localStorage on mount
  useEffect(() => {
    store.initializeFromStorage();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        store.setLoading(true);
        store.setError(null);

        // Check against hardcoded admin account
        if (
          credentials.email === ADMIN_ACCOUNT.email &&
          credentials.password === ADMIN_ACCOUNT.password
        ) {
          store.login(ADMIN_USER, ADMIN_TOKEN);
          return true;
        } else {
          store.setError('Invalid email or password');
          return false;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed. Please try again.';
        store.setError(errorMessage);
        return false;
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const logout = useCallback(() => {
    store.logout();
  }, [store]);

  const updateUser = useCallback(
    (user: AuthUser) => {
      store.setUser(user);
    },
    []
  );

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login,
    logout,
    updateUser,
  };
};
