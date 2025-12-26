/**
 * Facebook Connect Component
 * Guides user through Facebook OAuth connection
 */

'use client';

import { useFacebook } from '@/hooks/facebook';
import { useState } from 'react';

export function FacebookConnect() {
  const { connectFacebook, isConnecting, error, resetError } = useFacebook();
  const [isConnectingState, setIsConnectingState] = useState(false);

  const handleConnect = async () => {
    setIsConnectingState(true);
    resetError();
    try {
      await connectFacebook();
      // User will be redirected to Facebook OAuth
    } catch (err) {
      setIsConnectingState(false);
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
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting || isConnectingState}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConnecting || isConnectingState
            ? 'Connecting to Facebook...'
            : 'Connect Facebook'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          By connecting, you agree to grant necessary permissions for managing
          your Facebook pages and content.
        </p>
      </div>
    </div>
  );
}

