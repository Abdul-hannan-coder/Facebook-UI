'use client';

import { useGoogleOAuth } from '@/lib/hooks/googleoauth/useGoogleOAuth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const { useAutoHandleCallback, loading, error } = useGoogleOAuth();
  const result = useAutoHandleCallback();

  // Show loading state while processing
  if (loading || !result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700">Completing login...</p>
        </div>
      </div>
    );
  }

  // Show error if callback failed
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/login" className="text-blue-600 hover:underline">
            Return to login
          </a>
        </div>
      </div>
    );
  }

  // The hook will handle redirect, so just show loading
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-700">Redirecting...</p>
      </div>
    </div>
  );
}
