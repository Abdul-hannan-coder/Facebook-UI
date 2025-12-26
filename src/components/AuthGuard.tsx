/**
 * Auth Guard Component
 * Protects routes that require authentication
 */

'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect once and only if we're not already on the redirect page
    // Also ensure we're not in a loading state
    if (!isLoading && !isAuthenticated && !hasRedirected.current && pathname !== redirectTo) {
      hasRedirected.current = true;
      // Small delay to prevent flickering
      const timer = setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, pathname]);

  // Reset redirect flag if auth state changes to authenticated
  useEffect(() => {
    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>                                                   
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting (but don't render children)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>                                                   
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

