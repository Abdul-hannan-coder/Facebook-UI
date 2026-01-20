'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Facebook as FacebookIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { useFacebookOAuth } from '@/lib/hooks/facebookoauth/useFacebookOAuth';
import { useFacebookToken } from '@/lib/hooks/facebook/token/useFacebookToken';

export default function ConnectFacebookPage() {
  const router = useRouter();
  const { connect, loading: connectLoading, error: connectError } = useFacebookOAuth();
  const { hasToken, loading: tokenLoading, error: tokenError, reload: reloadToken } = useFacebookToken();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!tokenLoading && hasToken) {
      // Stop polling if token is found
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      router.replace('/dashboard');
    }
  }, [tokenLoading, hasToken, router]);

  // Cleanup poll interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
      // Start polling for token status after opening popup
      // Check every 2 seconds if token exists
      pollIntervalRef.current = setInterval(async () => {
        try {
          await reloadToken();
          // The useEffect above will handle redirect if token is found
        } catch (err) {
          // Ignore polling errors
        }
      }, 2000);
    } catch (err) {
      // Error already handled by hook
    }
  };

  const showError = connectError || tokenError;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-300/40">
              <FacebookIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Connect your Facebook
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-xl">
                We need permission to access your Facebook pages so Postsiva can fetch posts and
                publish content on your behalf.
              </p>
            </div>

            {showError && (
              <div className="w-full flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{showError}</span>
              </div>
            )}

            <div className="w-full">
              <button
                type="button"
                onClick={handleConnect}
                disabled={connectLoading || tokenLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-purple-300/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center space-x-2"
              >
                <FacebookIcon className="h-4 w-4" />
                <span>{connectLoading ? 'Opening Facebook...' : 'Continue with Facebook'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

