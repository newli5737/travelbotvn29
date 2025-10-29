import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthUser } from '@/types';
import axiosClient from '@/lib/axiosClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

export const useAuth = () => {
  const store = useAuthStore();

  // Initialize from localStorage on mount
  useEffect(() => {
    store.initializeFromStorage();
  }, [store]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        store.setLoading(true);
        store.setError(null);

        const response = await axiosClient.post<LoginResponse>('/auth/login', credentials);
        
        if (response.data) {
          store.login(response.data.user, response.data.token);
          return true;
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
    [store]
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
