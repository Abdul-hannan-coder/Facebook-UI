import { API_BASE_URL, setAccessToken, setUserInfo } from '../../apiClient';
import type { GoogleAuthResponse } from './types';
import { fetchFacebookToken } from '../facebook/token/api';

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
 * 
 * After storing the access token, immediately checks for Facebook token
 * and returns the appropriate redirect path.
 */
export async function handleGoogleCallbackFromSearch(search: string): Promise<{ response: GoogleAuthResponse; redirectPath: string } | null> {
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

  // Store the access token immediately
  setAccessToken(token);
  setUserInfo(user);

  const response: GoogleAuthResponse = {
    access_token: token,
    token_type: 'bearer',
    user,
  };

  // Immediately check for Facebook token after storing access token
  try {
    const fbTokenRes = await fetchFacebookToken();
    const hasFacebookToken = fbTokenRes.success && fbTokenRes.data && Object.keys(fbTokenRes.data).length > 0;
    
    // Return response with appropriate redirect path
    return {
      response,
      redirectPath: hasFacebookToken ? '/dashboard' : '/connect-facebook',
    };
  } catch (err) {
    // If check fails, assume no token and redirect to connect page
    return {
      response,
      redirectPath: '/connect-facebook',
    };
  }
}

