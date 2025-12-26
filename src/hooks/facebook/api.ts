/**
 * Facebook API Functions
 */

import { apiClient, handleAPIError } from '@/lib/api';
import {
  FacebookPagesResponse,
  FacebookUserProfile,
} from './types';

export const facebookAPI = {
  /**
   * Initiate Facebook OAuth flow
   * Returns OAuth URL to redirect user to Facebook
   * @param popup - If true, returns URL configured for popup mode
   */
  createToken: async (popup: boolean = false): Promise<string> => {
    try {
      const token = apiClient.getToken();
      
      const response = await fetch('/api/facebook/create-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ popup }),
      });

      if (!response.ok) {
        const error: unknown = await response.json().catch(() => ({
          detail: `API Error: ${response.status} ${response.statusText}`,
        }));
        throw error;
      }

      const data = await response.json();

      // Backend returns nested structure: { success, message, data: { auth_url } }
      if (data.success && data.data?.auth_url) {
        return data.data.auth_url;
      }

      // Also check for oauth_url in case backend returns different structure
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
   * Note: The callback is usually handled directly by the backend, so this may not be needed
   */
  handleCallback: async (code?: string, state?: string): Promise<void> => {
    try {
      // The OAuth callback is typically handled server-side by the backend
      // This function is kept for compatibility but may not be used
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';
      const token = apiClient.getToken();
      
      const params = new URLSearchParams();
      if (code) params.append('code', code);
      if (state) params.append('state', state);

      const queryString = params.toString();
      // Note: This would need a proxy route if used, but typically backend handles this
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
      const token = apiClient.getToken();
      
      const response = await fetch('/api/facebook/pages', {
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

      const data = await response.json();
      
      // Backend returns nested structure: { success, message, data: { pages, count } }
      if (data.success && data.data) {
        return data.data;
      }

      return data;
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
      // Use Next.js API route to avoid CORS
      const token = apiClient.getToken();
      
      const response = await fetch('/api/facebook/user-profile', {
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

