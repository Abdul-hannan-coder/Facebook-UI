/**
 * useFacebook Hook
 * Custom React hook for Facebook integration management
 */

'use client';

import { useReducer, useCallback } from 'react';
import { facebookReducer, initialState } from './reducers';
import { facebookAPI } from './api';
import { FacebookPage, FacebookUserProfile } from './types';

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
  checkToken: () => Promise<boolean>;
  resetError: () => void;
}

export const useFacebook = (): UseFacebookReturn => {
  const [state, dispatch] = useReducer(facebookReducer, initialState);

  /**
   * Check for existing Facebook token on mount (only once)
   * This is now controlled by the component that uses it
   */
  // Removed auto-initialization to prevent multiple checks
  // Components should call checkToken() explicitly when needed

  /**
   * Check if user has valid Facebook token
   */
  const checkToken = useCallback(async (): Promise<boolean> => {
    try {
      const hasToken = await facebookAPI.checkToken();
      dispatch({
        type: 'FACEBOOK_SET_TOKEN_STATUS',
        payload: { hasToken },
      });
      return hasToken;
    } catch {
      dispatch({
        type: 'FACEBOOK_SET_TOKEN_STATUS',
        payload: { hasToken: false },
      });
      return false;
    }
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
   * Initiate Facebook OAuth connection
   * Opens Facebook OAuth in a popup window
   */
  const connectFacebook = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_CONNECT_START' });
    try {
      // Request OAuth URL in popup mode
      const oauthUrl = await facebookAPI.createToken(true);
      
      // Open popup window
      const popup = window.open(
        oauthUrl,
        'facebook-oauth',
        'width=600,height=700,left=' + (window.screen.width - 600) / 2 + ',top=' + (window.screen.height - 700) / 2 + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for popup messages
      const messageHandler = (event: MessageEvent) => {
        // Verify origin (adjust based on your backend domain)
        const allowedOrigins = [
          window.location.origin,
          'https://backend.postsiva.com',
          process.env.NEXT_PUBLIC_API_BASE_URL || '',
        ].filter(Boolean);

        if (!allowedOrigins.includes(event.origin)) {
          return;
        }

        if (event.data.type === 'FACEBOOK_OAUTH_SUCCESS') {
          window.removeEventListener('message', messageHandler);
          if (!popup.closed) {
            popup.close();
          }
          
          // Refresh token status and verify token was received
          checkToken().then((hasToken) => {
            if (hasToken) {
              dispatch({ type: 'FACEBOOK_CONNECT_SUCCESS' });
              // Fetch pages after successful connection
              fetchPages().catch(() => {
                // Error handled by hook
              });
              
              // Redirect to dashboard if we're on connect page
              if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (currentPath === '/connect-facebook' || currentPath.includes('connect')) {
                  // Use router if available, otherwise use window.location
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 500);
                }
              }
            } else {
              // Token not received, show error
              dispatch({
                type: 'FACEBOOK_FAILURE',
                payload: { error: 'Token not received. Please try again.' },
              });
            }
          }).catch(() => {
            dispatch({
              type: 'FACEBOOK_FAILURE',
              payload: { error: 'Failed to verify connection. Please try again.' },
            });
          });
        } else if (event.data.type === 'FACEBOOK_OAUTH_ERROR') {
          window.removeEventListener('message', messageHandler);
          if (!popup.closed) {
            popup.close();
          }
          
          const errorMessage = event.data.error || 'Facebook connection failed';
          dispatch({
            type: 'FACEBOOK_FAILURE',
            payload: { error: errorMessage },
          });
        }
      };

      window.addEventListener('message', messageHandler);

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          
          // Only show error if connection wasn't successful
          if (!state.isConnected) {
            dispatch({
              type: 'FACEBOOK_FAILURE',
              payload: { error: 'Connection cancelled' },
            });
          }
        }
      }, 500);

      // Cleanup after timeout (5 minutes)
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        if (!popup.closed) {
          popup.close();
        }
      }, 5 * 60 * 1000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect Facebook';
      dispatch({
        type: 'FACEBOOK_FAILURE',
        payload: { error: errorMessage },
      });
      throw error;
    }
  }, [checkToken, fetchPages, state.isConnected]);

  /**
   * Disconnect Facebook (clear local state)
   * Note: This doesn't revoke the token on backend
   * You may want to add a backend endpoint for that
   */
  const disconnectFacebook = useCallback(() => {
    dispatch({ type: 'FACEBOOK_DISCONNECT' });
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

