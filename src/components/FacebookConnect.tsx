/**
 * Facebook Connect Component
 * Guides user through Facebook OAuth connection
 */

'use client';

import { useFacebook } from '@/hooks/facebook';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function FacebookConnect() {
  const { connectFacebook, isConnecting, error, resetError, hasToken, isConnected } = useFacebook();
  const router = useRouter();
  const [isConnectingState, setIsConnectingState] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Redirect to dashboard if token is received (after popup closes)
  useEffect(() => {
    if (hasToken && isConnected && !isConnecting && !isConnectingState) {
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasToken, isConnected, isConnecting, isConnectingState, router]);

  const handleConnect = async () => {
    setIsConnectingState(true);
    setPopupBlocked(false);
    resetError();
    try {
      await connectFacebook();
      // Popup will handle the OAuth flow
      // State will be updated via message listener
      // Redirect will happen in useEffect when token is received
    } catch (err) {
      setIsConnectingState(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect Facebook';
      
      // Check if it's a popup blocked error
      if (errorMessage.includes('popup') || errorMessage.includes('blocked')) {
        setPopupBlocked(true);
      }
      
      console.error('Failed to connect Facebook:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Connect Your Facebook</h2>
          <p className="text-gray-600">
            Connect your Facebook account to start managing your pages and posts
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-blue-900">What you&apos;ll get:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Manage all your Facebook pages</li>
            <li>Create and schedule posts</li>
            <li>Manage stories and content</li>
            <li>Automate your social media</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            {popupBlocked && (
              <p className="text-sm text-red-700 mt-2">
                Please allow popups for this site and try again.
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting || isConnectingState}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"                                                                      
        >
          {isConnecting || isConnectingState
            ? 'Opening Facebook connection...'
            : 'Connect Facebook'}
        </button>
        
        {isConnecting || isConnectingState ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 text-center">
              A popup window will open for Facebook authentication. Please complete the process in the popup.
            </p>
            <p className="text-xs text-gray-400 text-center">
              After successful connection, you will be redirected to the dashboard.
            </p>
          </div>
        ) : null}

        <p className="text-sm text-gray-500 text-center">
          By connecting, you agree to grant necessary permissions for managing
          your Facebook pages and content.
        </p>
      </div>
    </div>
  );
}

