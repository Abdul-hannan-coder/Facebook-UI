# Facebook OAuth Popup Flow Implementation Guide

## Overview
This guide implements a popup-based Facebook OAuth flow that opens Facebook authentication in a popup window, handles the callback, and updates the parent window state.

## 1. Popup OAuth Hook

Create: `src/hooks/facebook/usePopupOAuth.ts`

```typescript
import { useState, useCallback } from 'react';
import { facebookAPI } from './api';

interface PopupOAuthResult {
  success: boolean;
  error?: string;
}

export const usePopupOAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWithPopup = useCallback(async (): Promise<PopupOAuthResult> => {
    setIsConnecting(true);

    try {
      // Get OAuth URL from backend
      const authUrl = await facebookAPI.createToken();
      
      // Open popup window
      const popup = window.open(
        authUrl,
        'facebook-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Wait for popup to complete OAuth
      const result = await waitForPopupCallback(popup);
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth failed'
      };
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    connectWithPopup,
    isConnecting
  };
};

// Helper function to wait for popup completion
const waitForPopupCallback = (popup: Window): Promise<PopupOAuthResult> => {
  return new Promise((resolve) => {
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        // Check if OAuth was successful by trying to fetch pages
        facebookAPI.checkToken()
          .then((hasToken) => {
            resolve({
              success: hasToken,
              error: hasToken ? undefined : 'OAuth was cancelled or failed'
            });
          })
          .catch(() => {
            resolve({
              success: false,
              error: 'Failed to verify OAuth completion'
            });
          });
      }
    }, 1000);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!popup.closed) {
        popup.close();
      }
      clearInterval(checkClosed);
      resolve({
        success: false,
        error: 'OAuth timeout'
      });
    }, 300000);
  });
};
```

## 2. OAuth Callback Page

Create: `src/app/oauth/facebook/callback/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';

export default function FacebookOAuthCallback() {
  useEffect(() => {
    // Close popup window after OAuth completion
    // The parent window will detect the closure and check token status
    window.close();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Facebook authentication...</p>
        <p className="text-sm text-gray-500">This window will close automatically.</p>
      </div>
    </div>
  );
}
```

## 3. Facebook Connect Component

Create: `src/components/facebook/FacebookConnect.tsx`

```typescript
'use client';

import { useState } from 'react';
import { usePopupOAuth } from '@/hooks/facebook/usePopupOAuth';
import { Button } from '@/components/ui/button';
import { Facebook, Loader2, AlertCircle } from 'lucide-react';

interface FacebookConnectProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const FacebookConnect = ({ onSuccess, onError }: FacebookConnectProps) => {
  const { connectWithPopup, isConnecting } = usePopupOAuth();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    
    const result = await connectWithPopup();
    
    if (result.success) {
      onSuccess?.();
    } else {
      const errorMsg = result.error || 'Failed to connect Facebook';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Facebook...
          </>
        ) : (
          <>
            <Facebook className="mr-2 h-4 w-4" />
            Connect Facebook Account
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>By connecting, you grant permission to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>View your Facebook pages</li>
          <li>Create and manage posts</li>
          <li>Read page engagement data</li>
        </ul>
      </div>
    </div>
  );
};
```

## 4. Facebook Connect Page

Create: `src/app/connect-facebook/page.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { FacebookConnect } from '@/components/facebook/FacebookConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConnectFacebookPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to dashboard after successful connection
    router.push('/dashboard');
  };

  const handleError = (error: string) => {
    console.error('Facebook connection error:', error);
    // Could show toast notification here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect Facebook</CardTitle>
          <CardDescription>
            Connect your Facebook account to start managing your pages and posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FacebookConnect 
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

## 5. Update Backend Callback Route

Update: `src/app/api/facebook/oauth/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(
      new URL(`/oauth/facebook/callback?error=${error}`, request.url)
    );
  }

  // Handle successful OAuth
  if (code && state) {
    try {
      // Forward to backend for token exchange
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';
      const response = await fetch(`${backendUrl}/facebook/oauth/callback?code=${code}&state=${state}`);
      
      if (response.ok) {
        // Redirect to success page that closes popup
        return NextResponse.redirect(
          new URL('/oauth/facebook/callback', request.url)
        );
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
    }
  }

  // Redirect to error page
  return NextResponse.redirect(
    new URL('/oauth/facebook/callback?error=invalid_request', request.url)
  );
}
```

## 6. Enhanced Facebook Hook with Popup Support

Update: `src/hooks/facebook/useFacebook.ts`

```typescript
'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { facebookAPI } from './api';
import { FacebookState, FacebookAction } from './types';
import { usePopupOAuth } from './usePopupOAuth';

const initialState: FacebookState = {
  pages: [],
  userProfile: null,
  isConnected: false,
  isLoading: false,
  isConnecting: false,
  error: null,
  hasToken: false,
};

const facebookReducer = (state: FacebookState, action: FacebookAction): FacebookState => {
  switch (action.type) {
    case 'FACEBOOK_START':
      return { ...state, isLoading: true, error: null };
    
    case 'FACEBOOK_CONNECT_START':
      return { ...state, isConnecting: true, error: null };
    
    case 'FACEBOOK_CONNECT_SUCCESS':
      return { 
        ...state, 
        isConnecting: false, 
        isConnected: true, 
        hasToken: true,
        error: null 
      };
    
    case 'FACEBOOK_PAGES_SUCCESS':
      return {
        ...state,
        pages: action.payload.pages,
        isLoading: false,
        isConnected: true,
        hasToken: true,
        error: null,
      };
    
    case 'FACEBOOK_FAILURE':
      return {
        ...state,
        isLoading: false,
        isConnecting: false,
        error: action.payload.error,
      };
    
    case 'FACEBOOK_SET_TOKEN_STATUS':
      return {
        ...state,
        hasToken: action.payload.hasToken,
        isConnected: action.payload.hasToken,
      };
    
    case 'FACEBOOK_DISCONNECT':
      return {
        ...initialState,
        hasToken: false,
        isConnected: false,
      };
    
    default:
      return state;
  }
};

export const useFacebook = () => {
  const [state, dispatch] = useReducer(facebookReducer, initialState);
  const { connectWithPopup, isConnecting: popupConnecting } = usePopupOAuth();

  // Check token status on mount
  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        const hasToken = await facebookAPI.checkToken();
        dispatch({ 
          type: 'FACEBOOK_SET_TOKEN_STATUS', 
          payload: { hasToken } 
        });
      } catch {
        dispatch({ 
          type: 'FACEBOOK_SET_TOKEN_STATUS', 
          payload: { hasToken: false } 
        });
      }
    };

    checkTokenStatus();
  }, []);

  // Fetch pages when connected
  const fetchPages = useCallback(async () => {
    if (!state.hasToken) return;

    dispatch({ type: 'FACEBOOK_START' });
    
    try {
      const pagesData = await facebookAPI.getPages();
      dispatch({
        type: 'FACEBOOK_PAGES_SUCCESS',
        payload: { pages: pagesData.pages || [] },
      });
    } catch (error) {
      dispatch({
        type: 'FACEBOOK_FAILURE',
        payload: { error: error instanceof Error ? error.message : 'Failed to fetch pages' },
      });
    }
  }, [state.hasToken]);

  // Connect with popup
  const connectFacebook = useCallback(async () => {
    dispatch({ type: 'FACEBOOK_CONNECT_START' });
    
    const result = await connectWithPopup();
    
    if (result.success) {
      dispatch({ type: 'FACEBOOK_CONNECT_SUCCESS' });
      // Fetch pages after successful connection
      await fetchPages();
    } else {
      dispatch({
        type: 'FACEBOOK_FAILURE',
        payload: { error: result.error || 'Connection failed' },
      });
    }
  }, [connectWithPopup, fetchPages]);

  return {
    ...state,
    isConnecting: state.isConnecting || popupConnecting,
    connectFacebook,
    fetchPages,
    clearError: () => dispatch({ type: 'FACEBOOK_RESET_ERROR' }),
  };
};
```

## 7. Usage in Dashboard

```typescript
// src/app/dashboard/page.tsx
'use client';

import { useFacebook } from '@/hooks/facebook/useFacebook';
import { FacebookConnect } from '@/components/facebook/FacebookConnect';
import { useEffect } from 'react';

export default function Dashboard() {
  const { hasToken, pages, isLoading, connectFacebook } = useFacebook();

  if (!hasToken) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Setup Required</h1>
          <FacebookConnect onSuccess={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {isLoading ? (
        <div>Loading pages...</div>
      ) : (
        <div>
          <h2 className="text-xl mb-4">Your Facebook Pages ({pages.length})</h2>
          {pages.map((page) => (
            <div key={page.page_id} className="border p-4 rounded mb-2">
              <h3 className="font-semibold">{page.page_name}</h3>
              <p className="text-sm text-gray-600">{page.page_category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 8. Route Configuration

Add to `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/facebook/oauth/callback',
        destination: '/api/facebook/oauth/callback',
      },
    ];
  },
};

export default nextConfig;
```

## Implementation Steps:

1. **Create the popup OAuth hook** (`usePopupOAuth.ts`)
2. **Create the callback page** (`/oauth/facebook/callback/page.tsx`)
3. **Create the connect component** (`FacebookConnect.tsx`)
4. **Create the connect page** (`/connect-facebook/page.tsx`)
5. **Add the callback API route** (`/api/facebook/oauth/callback/route.ts`)
6. **Update the Facebook hook** (`useFacebook.ts`)
7. **Test the complete flow**

## Key Features:

- ✅ Popup-based OAuth (no page redirects)
- ✅ Automatic popup closure detection
- ✅ Error handling and timeouts
- ✅ Loading states and user feedback
- ✅ Seamless integration with existing hooks
- ✅ TypeScript support throughout

The popup will open Facebook OAuth, handle the callback, close automatically, and update your app state without any page refreshes!
