'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { googleOAuthReducer, initialGoogleOAuthState } from './reducers';
import { buildGoogleLoginUrl, handleGoogleCallbackFromSearch } from './api';
import type { GoogleAuthResponse } from './types';

export function useGoogleOAuth() {
  const [state, dispatch] = useReducer(googleOAuthReducer, initialGoogleOAuthState);

  const startLogin = useCallback((redirectPath?: string) => {
    dispatch({ type: 'GOOGLE_OAUTH_START' });
    try {
      const url = buildGoogleLoginUrl({ redirectPath });
      window.location.href = url;
    } catch (err: any) {
      dispatch({
        type: 'GOOGLE_OAUTH_ERROR',
        payload: err.message ?? 'Failed to start Google login',
      });
    }
  }, []);

  const handleCallback = useCallback((search: string): GoogleAuthResponse | null => {
    dispatch({ type: 'GOOGLE_OAUTH_START' });
    try {
      const result = handleGoogleCallbackFromSearch(search);
      if (!result) {
        dispatch({
          type: 'GOOGLE_OAUTH_ERROR',
          payload: 'Invalid or missing Google auth parameters',
        });
        return null;
      }
      dispatch({ type: 'GOOGLE_OAUTH_SUCCESS' });
      return result;
    } catch (err: any) {
      dispatch({
        type: 'GOOGLE_OAUTH_ERROR',
        payload: err.message ?? 'Failed to process Google callback',
      });
      return null;
    }
  }, []);

  // Optional: auto-handle callback when mounted on a dedicated callback page
  const useAutoHandleCallback = (): GoogleAuthResponse | null => {
    const [result, setResult] = useReducer(
      (state: GoogleAuthResponse | null, action: GoogleAuthResponse | null) => action,
      null,
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const res = handleCallback(window.location.search);
      if (res) setResult(res);
    }, [handleCallback]);

    return result;
  };

  return {
    ...state,
    startLogin,
    handleCallback,
    useAutoHandleCallback,
  };
}

