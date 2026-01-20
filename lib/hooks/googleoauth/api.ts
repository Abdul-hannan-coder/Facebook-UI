import { API_BASE_URL, setAccessToken, setUserInfo } from '../../apiClient';
import type { GoogleAuthResponse } from './types';

/**
 * Build the Google login URL on the backend.
 * Frontend will redirect the browser to this URL.
 */
export function buildGoogleLoginUrl(params?: { redirectPath?: string }): string {
  if (typeof window === 'undefined') {
    return `${API_BASE_URL}/auth/google/login`;
  }

  const origin = window.location.origin;
  const redirectPath =
    (params && params.redirectPath != null ? params.redirectPath : window.location.pathname) ||
    '/';

  const url = new URL(`${API_BASE_URL}/auth/google/login`);
  url.searchParams.set('redirect_uri', redirectPath);
  url.searchParams.set('origin', origin);

  return url.toString();
}

/**
 * Handle Google callback query params on the frontend.
 * Expects backend to have redirected like:
 *   FRONTEND_URL + redirect_path?token=...&user=...&email=...&success=true
 */
export function handleGoogleCallbackFromSearch(search: string): GoogleAuthResponse | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(search);
  const token = params.get('token');
  const email = params.get('email');
  const username = params.get('user');
  const success = params.get('success');

  if (!token || success !== 'true' || !email || !username) {
    return null;
  }

  const user = {
    id: '', // backend does not send ID in query; main identity is email
    email,
    username,
    full_name: null,
    profile_picture: null,
  };

  setAccessToken(token);
  setUserInfo(user);

  return {
    access_token: token,
    token_type: 'bearer',
    user,
  };
}

