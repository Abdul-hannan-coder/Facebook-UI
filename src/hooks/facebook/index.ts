/**
 * useFacebook Hook
 * Custom React hook for Facebook integration management
 */

'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { facebookReducer, initialState } from './reducers';
import { facebookAPI } from './api';

export interface UseFacebookReturn {
  // State
  pages: FacebookPage[];
  userProfile: FacebookUserProfile | null;
  isConnected: boolean;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  hasToken: boolean;

  // Actions
  connectFacebook: () => Promise<void>;
  disconnectFacebook: () => void;
  fetchPages: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  checkToken: () => Promise<void>;
  resetError: () => void;
}

export const useFacebook = (): UseFacebookReturn => {
  const [state, dispatch] = useReducer(facebookReducer, initialState);

  /**
   * Check for existing Facebook token on mount
   */
  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const hasToken = await facebookAPI.checkToken();
        dispatch({
          type: 'FACEBOOK_SET_TOKEN_STATUS',
          payload: { hasToken },
        });

        if (hasToken) {
          // If token exists, fetch pages and profile
          await fetchPages();
          await fetchUserProfile();
        }
      } catch {
        // Token check failed, user needs to connect
        dispatch({
          type: 'FACEBOOK_SET_TOKEN_STATUS',
          payload: { hasToken: false },
        });
      }
    };

    checkExistingToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initiate Facebook OAuth connection
   * Redirects user to Facebook OAuth page
   */
  const connectFacebook = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_CONNECT_START' });
    try {
      const oauthUrl = await facebookAPI.createToken();
      // Redirect to Facebook OAuth
      window.location.href = oauthUrl;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect Facebook';
      dispatch({
        type: 'FACEBOOK_FAILURE',
        payload: { error: errorMessage },
      });
      throw error;
    }
  }, []);

  /**
   * Disconnect Facebook (clear local state)
   * Note: This doesn't revoke the token on backend
   * You may want to add a backend endpoint for that
   */
  const disconnectFacebook = useCallback(() => {
    dispatch({ type: 'FACEBOOK_DISCONNECT' });
  }, []);

  /**
   * Fetch Facebook pages
   */
  const fetchPages = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_START' });
    try {
      const response = await facebookAPI.getPages();
      if (response.data && response.data.pages) {
        dispatch({
          type: 'FACEBOOK_PAGES_SUCCESS',
          payload: { pages: response.data.pages },
        });
      } else {
        dispatch({
          type: 'FACEBOOK_FAILURE',
          payload: { error: 'No pages found' },
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch pages';
      dispatch({
        type: 'FACEBOOK_FAILURE',
        payload: { error: errorMessage },
      });
      throw error;
    }
  }, []);

  /**
   * Fetch Facebook user profile
   */
  const fetchUserProfile = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_START' });
    try {
      const profile = await facebookAPI.getUserProfile();
      dispatch({
        type: 'FACEBOOK_PROFILE_SUCCESS',
        payload: { profile },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch user profile';
      dispatch({
        type: 'FACEBOOK_FAILURE',
        payload: { error: errorMessage },
      });
      throw error;
    }
  }, []);

  /**
   * Check if user has valid Facebook token
   */
  const checkToken = useCallback(async () => {
    try {
      const hasToken = await facebookAPI.checkToken();
      dispatch({
        type: 'FACEBOOK_SET_TOKEN_STATUS',
        payload: { hasToken },
      });
    } catch {
      dispatch({
        type: 'FACEBOOK_SET_TOKEN_STATUS',
        payload: { hasToken: false },
      });
    }
  }, []);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    dispatch({ type: 'FACEBOOK_RESET_ERROR' });
  }, []);

  return {
    // State
    pages: state.pages,
    userProfile: state.userProfile,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    isConnecting: state.isConnecting,
    error: state.error,
    hasToken: state.hasToken,

    // Actions
    connectFacebook,
    disconnectFacebook,
    fetchPages,
    fetchUserProfile,
    checkToken,
    resetError,
  };
};

