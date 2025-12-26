/**
 * Facebook Token Checker Component
 * Checks if user has Facebook token and redirects accordingly
 */

'use client';

import { useFacebook } from '@/hooks/facebook';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface FacebookTokenCheckerProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallbackPath?: string;
}

export function FacebookTokenChecker({
  children,
  redirectTo = '/dashboard',
  fallbackPath = '/connect-facebook',
}: FacebookTokenCheckerProps) {
  const { isAuthenticated } = useAuth();
  const { hasToken, isLoading, checkToken } = useFacebook();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const verifyToken = async () => {
      await checkToken();
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (hasToken) {
        router.push(redirectTo);
      } else {
        router.push(fallbackPath);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken, isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking Facebook connection...</p>
        </div>
      </div>
    );
  }

  // If token exists, show children (dashboard)
  // If no token, redirect will happen in useEffect
  if (hasToken) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

