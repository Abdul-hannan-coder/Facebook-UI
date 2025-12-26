# Implementation Guide - User Journey

This guide shows how to implement the complete user journey using the custom hooks.

## User Journey Flow

```
Landing → Login/Signup → Token Check → Facebook Connect → Dashboard
```

## Step-by-Step Implementation

### 1. Create Route Pages

#### Landing Page (`/`)
```typescript
// app/page.tsx or pages/index.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Facebook Automation</h1>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
    </div>
  );
}
```

#### Login Page (`/login`)
```typescript
// app/login/page.tsx
'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Check Facebook token after login
      router.push('/check-facebook');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### Facebook Token Check Page (`/check-facebook`)
```typescript
// app/check-facebook/page.tsx
'use client';

import { FacebookTokenChecker } from '@/components/FacebookTokenChecker';
import { AuthGuard } from '@/components/AuthGuard';

export default function CheckFacebookPage() {
  return (
    <AuthGuard>
      <FacebookTokenChecker>
        <div>Loading...</div>
      </FacebookTokenChecker>
    </AuthGuard>
  );
}
```

#### Connect Facebook Page (`/connect-facebook`)
```typescript
// app/connect-facebook/page.tsx
'use client';

import { FacebookConnect } from '@/components/FacebookConnect';
import { AuthGuard } from '@/components/AuthGuard';

export default function ConnectFacebookPage() {
  return (
    <AuthGuard>
      <FacebookConnect />
    </AuthGuard>
  );
}
```

#### OAuth Callback Handler (`/facebook/callback`)
```typescript
// app/facebook/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFacebook } from '@/hooks/facebook';

export default function FacebookCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkToken } = useFacebook();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Backend should handle the callback automatically
        // Just wait a moment and check token status
        await new Promise(resolve => setTimeout(resolve, 2000));
        const hasToken = await checkToken();
        
        if (hasToken) {
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    processCallback();
  }, [checkToken, router]);

  if (status === 'processing') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Processing Facebook connection...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <p className="text-xl">Facebook connected successfully!</p>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-red-600 text-4xl mb-4">✗</div>
        <p className="text-xl">Failed to connect Facebook</p>
        <button onClick={() => router.push('/connect-facebook')}>
          Try Again
        </button>
      </div>
    </div>
  );
}
```

#### Dashboard (`/dashboard`)
```typescript
// app/dashboard/page.tsx
'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { useFacebook } from '@/hooks/facebook';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { pages, fetchPages, isLoading, hasToken } = useFacebook();

  useEffect(() => {
    if (hasToken) {
      fetchPages();
    }
  }, [hasToken, fetchPages]);

  if (!hasToken) {
    return (
      <div>
        <p>Please connect your Facebook account</p>
        <a href="/connect-facebook">Connect Facebook</a>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {isLoading ? (
          <div>Loading pages...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Your Facebook Pages ({pages.length})
            </h2>
            {pages.map((page) => (
              <div key={page.page_id} className="border p-4 rounded mb-4">
                <h3 className="font-semibold">{page.page_name}</h3>
                <p className="text-sm text-gray-600">{page.page_category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
```

### 2. Using the Components

#### AuthGuard
Protects any route that requires authentication:
```typescript
import { AuthGuard } from '@/components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

#### FacebookTokenChecker
Checks Facebook token and redirects accordingly:
```typescript
import { FacebookTokenChecker } from '@/components/FacebookTokenChecker';

export default function CheckPage() {
  return (
    <FacebookTokenChecker>
      <div>User has Facebook token</div>
    </FacebookTokenChecker>
  );
}
```

#### FacebookConnect
Provides UI for connecting Facebook:
```typescript
import { FacebookConnect } from '@/components/FacebookConnect';

export default function ConnectPage() {
  return <FacebookConnect />;
}
```

### 3. Complete Flow Example

```typescript
// After successful login
const { login, isAuthenticated } = useAuth();
const { hasToken, checkToken } = useFacebook();
const router = useRouter();

useEffect(() => {
  if (isAuthenticated) {
    checkToken().then(() => {
      if (hasToken) {
        router.push('/dashboard');
      } else {
        router.push('/connect-facebook');
      }
    });
  }
}, [isAuthenticated, hasToken, checkToken, router]);
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://backend.postsiva.com
```

## Testing the Flow

1. Start at landing page (`/`)
2. Click "Login" → Go to `/login`
3. Enter credentials → After login, redirect to `/check-facebook`
4. If no token → Redirect to `/connect-facebook`
5. Click "Connect Facebook" → Redirect to Facebook OAuth
6. Authorize app → Redirect to `/facebook/callback`
7. Backend processes → Redirect to `/dashboard`
8. Dashboard shows Facebook pages

## Error Handling

All hooks handle errors automatically. Check the `error` state:

```typescript
const { error, resetError } = useAuth();
const { error: fbError } = useFacebook();

// Display errors in UI
{error && <ErrorMessage message={error} onDismiss={resetError} />}
{fbError && <ErrorMessage message={fbError} />}
```

## Next Steps

1. Implement the route pages as shown above
2. Add styling to match your design
3. Add loading states and error boundaries
4. Implement additional Facebook features (posts, stories, etc.)
5. Add analytics and monitoring

