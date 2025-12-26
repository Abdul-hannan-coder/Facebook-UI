# Facebook Hook

Custom React hook for Facebook integration and OAuth management.

## Structure

- `types.ts` - TypeScript types and interfaces
- `reducers.ts` - Reducer for managing Facebook state
- `api.ts` - API functions for Facebook operations
- `index.ts` - Main hook implementation

## Usage

### Basic Connection Flow

```typescript
import { useFacebook } from '@/hooks/facebook';

function ConnectFacebookPage() {
  const { connectFacebook, isConnecting, error } = useFacebook();

  const handleConnect = async () => {
    try {
      await connectFacebook();
      // User will be redirected to Facebook OAuth
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect Facebook'}
      </button>
    </div>
  );
}
```

### Fetching Pages

```typescript
function FacebookPagesList() {
  const { pages, fetchPages, isLoading } = useFacebook();

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  if (isLoading) return <div>Loading pages...</div>;

  return (
    <div>
      <h2>Your Facebook Pages</h2>
      {pages.map((page) => (
        <div key={page.page_id}>
          <h3>{page.page_name}</h3>
          <p>Category: {page.page_category}</p>
        </div>
      ))}
    </div>
  );
}
```

### Checking Token Status

```typescript
function Dashboard() {
  const { hasToken, checkToken, isConnected } = useFacebook();

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  if (!hasToken) {
    return <Navigate to="/connect-facebook" />;
  }

  return <div>Dashboard content...</div>;
}
```

## API

### State

- `pages: FacebookPage[]` - List of connected Facebook pages
- `userProfile: FacebookUserProfile | null` - Facebook user profile
- `isConnected: boolean` - Whether Facebook is connected
- `isLoading: boolean` - Whether a Facebook operation is in progress
- `isConnecting: boolean` - Whether OAuth connection is in progress
- `error: string | null` - Current error message
- `hasToken: boolean` - Whether user has a valid Facebook token

### Actions

- `connectFacebook()` - Initiate Facebook OAuth flow (redirects to Facebook)
- `disconnectFacebook()` - Clear local Facebook state
- `fetchPages()` - Fetch user's Facebook pages
- `fetchUserProfile()` - Fetch Facebook user profile
- `checkToken()` - Check if user has valid Facebook token
- `resetError()` - Clear error state

## User Journey Integration

This hook follows the user journey flow:

1. **After Login**: Check if user has Facebook token
2. **If No Token**: Redirect to `/connect-facebook`
3. **Connect Flow**: User clicks "Connect Facebook" → Redirects to Facebook OAuth
4. **OAuth Callback**: Backend handles callback and stores token
5. **Dashboard**: User can now access Facebook features

## OAuth Flow

1. User clicks "Connect Facebook"
2. `connectFacebook()` is called
3. Backend returns OAuth URL
4. User is redirected to Facebook
5. User authorizes the app
6. Facebook redirects to `/facebook/oauth/callback`
7. Backend processes callback and stores token
8. User is redirected to dashboard

## Error Handling

The hook automatically handles errors and stores them in the `error` state:

```typescript
const { error, resetError } = useFacebook();

if (error) {
  return (
    <div>
      <p className="error">{error}</p>
      <button onClick={resetError}>Dismiss</button>
    </div>
  );
}
```

