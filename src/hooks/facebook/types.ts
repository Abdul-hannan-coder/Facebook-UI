/**
 * Facebook Types
 */

export interface FacebookPage {
  page_id: string;
  page_name: string;
  page_access_token: string;
  page_category: string;
  page_permissions: string;
  expires_in: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface FacebookPagesResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    user_id: string;
    pages: FacebookPage[];
    count: number;
  };
}

export interface FacebookOAuthResponse {
  oauth_url?: string;
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  email?: string;
  [key: string]: unknown;
}

export interface FacebookState {
  pages: FacebookPage[];
  userProfile: FacebookUserProfile | null;
  isConnected: boolean;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  hasToken: boolean;
}

export type FacebookAction =
  | { type: 'FACEBOOK_START' }
  | { type: 'FACEBOOK_CONNECT_START' }
  | { type: 'FACEBOOK_CONNECT_SUCCESS' }
  | { type: 'FACEBOOK_PAGES_SUCCESS'; payload: { pages: FacebookPage[] } }
  | { type: 'FACEBOOK_PROFILE_SUCCESS'; payload: { profile: FacebookUserProfile } }
  | { type: 'FACEBOOK_FAILURE'; payload: { error: string } }
  | { type: 'FACEBOOK_DISCONNECT' }
  | { type: 'FACEBOOK_RESET_ERROR' }
  | { type: 'FACEBOOK_SET_TOKEN_STATUS'; payload: { hasToken: boolean } };

