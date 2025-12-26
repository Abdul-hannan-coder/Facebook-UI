/**
 * Example usage of useAuth hook
 * This is a reference implementation showing how to use the auth hook
 */

'use client';

import { useAuth } from './index';
import { useState } from 'react';

export function AuthExample() {
  const { login, signup, logout, user, isAuthenticated, isLoading, error, resetError } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetError();

    try {
      if (isSignup) {
        await signup({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          full_name: formData.full_name,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      // Success - user is now authenticated
      // You can redirect or show success message
    } catch (err) {
      // Error is already handled in the hook
      console.error('Auth error:', err);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="p-4">
        <h2>Welcome, {user.full_name}!</h2>
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isSignup ? 'Sign Up' : 'Login'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <>
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </>
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading
            ? isSignup
              ? 'Signing up...'
              : 'Logging in...'
            : isSignup
              ? 'Sign Up'
              : 'Login'}
        </button>
      </form>

      <button
        onClick={() => {
          setIsSignup(!isSignup);
          resetError();
        }}
        className="mt-4 text-blue-500"
      >
        {isSignup
          ? 'Already have an account? Login'
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}

