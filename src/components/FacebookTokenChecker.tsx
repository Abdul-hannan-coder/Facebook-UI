/**
 * Facebook Token Checker Component
 * Checks if user has Facebook token and redirects accordingly
 */

'use client';

import { useFacebook } from '@/hooks/facebook';
import { useAuth } from '@/hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasToken, isLoading: fbLoading, checkToken } = useFacebook();
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedToken = useRef(false);
  const hasRedirected = useRef(false);

  // Check token only once when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasCheckedToken.current) {
      hasCheckedToken.current = true;
      checkToken().catch(() => {
        // Error handled by hook
      });
    }
  }, [isAuthenticated, authLoading, checkToken]);

  // Redirect based on token status (only once, after loading completes)
  useEffect(() => {
    // Wait for both auth and fb loading to complete
    if (authLoading || fbLoading) return;
    
    // Only proceed if authenticated
    if (!isAuthenticated) return;
    
    // Only redirect once
    if (hasRedirected.current) return;
    
    // Check if we need to redirect
    if (hasToken) {
      // Has token - redirect to dashboard if not already there
      if (pathname !== redirectTo) {
        hasRedirected.current = true;
        // Small delay to prevent flickering
        const timer = setTimeout(() => {
          router.replace(redirectTo);
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      // No token - redirect to connect page if not already there
      if (pathname !== fallbackPath) {
        hasRedirected.current = true;
        // Small delay to prevent flickering
        const timer = setTimeout(() => {
          router.replace(fallbackPath);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [hasToken, fbLoading, authLoading, isAuthenticated, router, redirectTo, fallbackPath, pathname]);

  // Reset flags if auth state changes
  useEffect(() => {
    if (!isAuthenticated) {
      hasCheckedToken.current = false;
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  // Show loading while checking auth or token
  if (authLoading || fbLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>                                                   
          <p className="text-gray-600">Checking Facebook connection...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't show anything (AuthGuard should handle this)
  if (!isAuthenticated) {
    return null;
  }

  // Show loading while redirecting
  const isRedirecting = hasRedirected.current || 
    (hasToken && pathname !== redirectTo) || 
    (!hasToken && pathname !== fallbackPath);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>                                                     
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Only render children if we're on the correct page
  const isOnCorrectPage = (hasToken && pathname === redirectTo) || (!hasToken && pathname === fallbackPath);
  
  if (isOnCorrectPage) {
    return <>{children}</>;
  }

  // Default: show loading (shouldn't reach here normally)
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>                                                     
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

