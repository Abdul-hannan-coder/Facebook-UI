# Auth Hook

Custom React hook for authentication management.

## Structure

- `types.ts` - TypeScript types and interfaces
- `reducers.ts` - Reducer for managing auth state
- `api.ts` - API functions for authentication
- `index.ts` - Main hook implementation

## Usage

```typescript
import { useAuth } from '@/hooks/auth';

function LoginComponent() {
  const { login, isLoading, error, isAuthenticated, user } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({
        email: 'uzair1@postiva.com',
        password: '123123123',
      });
      // User is now logged in
    } catch (err) {
      // Error is already set in the hook state
      console.error('Login failed:', err);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.full_name}!</div>;
  }

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## API

### State

- `user: User | null` - Current authenticated user
- `token: string | null` - Authentication token
- `isAuthenticated: boolean` - Whether user is authenticated
- `isLoading: boolean` - Whether an auth operation is in progress
- `error: string | null` - Current error message

### Actions

- `login(credentials: LoginCredentials)` - Login with email and password
- `signup(data: SignupData)` - Create a new user account
- `logout()` - Logout current user
- `resetError()` - Clear error state

