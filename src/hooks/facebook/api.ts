/**
 * Facebook API Functions
 */

import { apiClient, handleAPIError } from '@/lib/api';
import {
  FacebookPagesResponse,
  FacebookOAuthResponse,
  FacebookUserProfile,
} from './types';

export const facebookAPI = {
  /**
   * Initiate Facebook OAuth flow
   * Returns OAuth URL to redirect user to Facebook
   */
  createToken: async (): Promise<string> => {
    try {
      // Use fetch directly since apiClient.request is private
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';
      const token = apiClient.getToken();
      
      const response = await fetch(`${baseURL}/facebook/create-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const error: unknown = await response.json().catch(() => ({
          detail: `API Error: ${response.status} ${response.statusText}`,
        }));
        throw error;
      }

      const data = await response.json() as FacebookOAuthResponse;

      if (data.oauth_url) {
        return data.oauth_url;
      }

      throw new Error('OAuth URL not received from server');
    } catch (error: unknown) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Handle OAuth callback (usually called by backend redirect)
   * This endpoint is typically hit by the backend after Facebook redirects
   */
  handleCallback: async (code?: string, state?: string): Promise<void> => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';
      const token = apiClient.getToken();
      
      const params = new URLSearchParams();
      if (code) params.append('code', code);
      if (state) params.append('state', state);

      const queryString = params.toString();
      const url = `${baseURL}/facebook/oauth/callback${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const error: unknown = await response.json().catch(() => ({
          detail: `API Error: ${response.status} ${response.statusText}`,
        }));
        throw error;
      }
    } catch (error: unknown) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get Facebook pages for the authenticated user
   */
  getPages: async (): Promise<FacebookPagesResponse> => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';
      const token = apiClient.getToken();
      
      const response = await fetch(`${baseURL}/facebook/pages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const error: unknown = await response.json().catch(() => ({
          detail: `API Error: ${response.status} ${response.statusText}`,
        }));
        throw error;
      }

      return await response.json() as FacebookPagesResponse;
    } catch (error: unknown) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get Facebook user profile
   */
  getUserProfile: async (): Promise<FacebookUserProfile> => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';
      const token = apiClient.getToken();
      
      const response = await fetch(`${baseURL}/facebook/user-profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const error: unknown = await response.json().catch(() => ({
          detail: `API Error: ${response.status} ${response.statusText}`,
        }));
        throw error;
      }

      return await response.json() as FacebookUserProfile;
    } catch (error: unknown) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Check if user has a valid Facebook token
   * This is done by attempting to fetch pages
   */
  checkToken: async (): Promise<boolean> => {
    try {
      await facebookAPI.getPages();
      return true;
    } catch {
      return false;
    }
  },
};

