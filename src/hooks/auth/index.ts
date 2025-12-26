/**
 * useAuth Hook
 * Custom React hook for authentication management
 */

'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { authReducer, initialState } from './reducers';
import { authAPI } from './api';
import { LoginCredentials, SignupData, User } from './types';

export interface UseAuthReturn {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  resetError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const hasInitialized = useRef(false);

  // Initialize auth state from localStorage on mount (only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const token = authAPI.getToken();
    if (token) {
      // Token exists, but we need to verify it's valid
      // For now, we'll just set the token state
      // In a real app, you might want to verify the token with the backend
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        } catch {
          // Invalid stored user, clear it
          localStorage.removeItem('user');
          authAPI.logout();
        }
      } else {
        // Token exists but no user, clear token
        authAPI.logout();
      }
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.login(credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token,
        },
      });
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: errorMessage },
      });
      throw error;
    }
  }, []);

  /**
   * Signup new user
   */
  const signup = useCallback(async (data: SignupData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.signup(data);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token,
        },
      });
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: errorMessage },
      });
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authAPI.logout();
    localStorage.removeItem('user');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    dispatch({ type: 'AUTH_RESET_ERROR' });
  }, []);

  return {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    signup,
    logout,
    resetError,
  };
};

