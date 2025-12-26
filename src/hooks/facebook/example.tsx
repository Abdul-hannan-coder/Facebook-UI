/**
 * Example usage of useFacebook hook
 * This is a reference implementation showing how to use the Facebook hook
 */

'use client';

import { useFacebook } from './index';
import { useEffect } from 'react';

export function FacebookExample() {
  const {
    pages,
    userProfile,
    isLoading,
    isConnecting,
    error,
    hasToken,
    connectFacebook,
    fetchPages,
    fetchUserProfile,
    checkToken,
    resetError,
  } = useFacebook();

  useEffect(() => {
    // Check token status on mount
    checkToken();
  }, [checkToken]);

  const handleConnect = async () => {
    try {
      await connectFacebook();
      // User will be redirected to Facebook OAuth
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleRefresh = async () => {
    await fetchPages();
    await fetchUserProfile();
  };

  if (!hasToken) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Connect Facebook</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button onClick={resetError} className="ml-2 text-red-900">
              ×
            </button>
          </div>
        )}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Facebook'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Facebook Dashboard</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
          <button onClick={resetError} className="ml-2 text-red-900">
            ×
          </button>
        </div>
      )}

      {isLoading && <div>Loading...</div>}

      {userProfile && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Profile</h3>
          <p>Name: {userProfile.name}</p>
          {userProfile.email && <p>Email: {userProfile.email}</p>}
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Your Facebook Pages ({pages.length})
        </h3>
        {pages.length === 0 ? (
          <p className="text-gray-600">No pages found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((page) => (
              <div
                key={page.page_id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg mb-2">{page.page_name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  Category: {page.page_category}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Permissions: {page.page_permissions}
                </p>
                {page.expires_at && (
                  <p className="text-xs text-gray-500">
                    Expires: {new Date(page.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

