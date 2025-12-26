/**
 * Authentication API Functions
 */

import { apiClient, handleAPIError } from '@/lib/api';
import { LoginCredentials, SignupData, AuthResponse } from './types';

export const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.login(
        credentials.email,
        credentials.password
      );
      // Set token in API client
      apiClient.setToken(response.access_token);
      return response;
    } catch (error: unknown) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Signup new user
   */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.signup(data);
      // Set token in API client
      apiClient.setToken(response.access_token);
      return response;
    } catch (error: unknown) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout user
   */
  logout: (): void => {
    apiClient.setToken(null);
  },

  /**
   * Get current token
   */
  getToken: (): string | null => {
    return apiClient.getToken();
  },
};

