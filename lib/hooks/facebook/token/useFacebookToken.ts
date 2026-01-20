'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FacebookTokenData, FacebookTokenState } from './types';
import { fetchFacebookToken } from './api';

interface UseFacebookTokenOptions {
  autoLoad?: boolean;
}

export function useFacebookToken(options: UseFacebookTokenOptions = {}) {
  const { autoLoad = true } = options;

  const [state, setState] = useState<FacebookTokenState>({
    loading: false,
    error: null,
    hasToken: false,
    token: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetchFacebookToken();
      const hasToken = res.success && res.data && Object.keys(res.data).length > 0;
      setState({
        loading: false,
        error: null,
        hasToken,
        token: hasToken ? (res.data as FacebookTokenData) : null,
      });
      return res;
    } catch (err: any) {
      setState({
        loading: false,
        error: err.message ?? 'Failed to load Facebook token',
        hasToken: false,
        token: null,
      });
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    load().catch(() => undefined);
  }, [autoLoad, load]);

  return {
    ...state,
    reload: load,
  };
}

