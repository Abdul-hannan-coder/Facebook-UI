# Facebook Automation Website - User Journey

## Overview
This Next.js application provides Facebook automation capabilities with a seamless OAuth integration flow. Users can manage their Facebook pages, create posts, and automate social media activities.

## User Journey Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Landing   │───▶│    Login     │───▶│ Token Check     │───▶│ Dashboard   │
│    Page     │    │    Page      │    │ (Facebook)      │    │             │
└─────────────┘    └──────────────┘    └─────────────────┘    └─────────────┘
                           │                      │
                           │                      ▼
                           │            ┌─────────────────┐
                           │            │ Facebook OAuth  │
                           │            │ Connect Page    │
                           │            └─────────────────┘
                           │                      │
                           ▼                      │
                   ┌──────────────┐              │
                   │   Signup     │              │
                   │    Page      │              │
                   └──────────────┘              │
                           │                      │
                           └──────────────────────┘
```

## Detailed User Journey

### 1. Landing Page
- **Entry Point**: User visits the website
- **Actions Available**:
  - Login (existing users)
  - Sign up (new users)
- **Navigation**: Redirect to login/signup forms

### 2. Authentication Flow

#### Login Process
```typescript
// User provides credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// API Response
interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  user: UserProfile;
}
```

#### Signup Process
```typescript
// New user registration
interface SignupData {
  email: string;
  username: string;
  full_name: string;
  password: string;
}
```

### 3. Facebook Token Verification

After successful login, the system checks for Facebook integration:

```typescript
// Check if user has Facebook token
const checkFacebookToken = async () => {
  try {
    const response = await fetch('/facebook/get-token', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    if (response.status === 200) {
      // User has Facebook token - redirect to dashboard
      router.push('/dashboard');
    } else {
      // No Facebook token - redirect to connect page
      router.push('/connect-facebook');
    }
  } catch (error) {
    // Handle error - redirect to connect page
    router.push('/connect-facebook');
  }
};
```

### 4. Facebook OAuth Connection Flow

#### 4.1 Facebook Connect Page
- **Purpose**: Guide user through Facebook OAuth
- **UI Elements**:
  - "Connect Facebook" button
  - Instructions about required permissions
  - Benefits of connecting Facebook

#### 4.2 OAuth Initiation
```typescript
const connectFacebook = async () => {
  // Initiate OAuth flow
  const response = await fetch('/facebook/create-token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` }
  });
  
  const { oauth_url } = await response.json();
  
  // Redirect to Facebook OAuth
  window.location.href = oauth_url;
};
```

#### 4.3 OAuth Callback
- **Endpoint**: `/facebook/oauth/callback`
- **Process**: 
  - Facebook redirects back with authorization code
  - Backend exchanges code for access token
  - Token stored in database
  - User redirected to dashboard

### 5. Dashboard (Main Application)

Once Facebook is connected, users access the main dashboard with:

#### Available Features:
- **Page Management**: View connected Facebook pages
- **Post Creation**: Create text, image, video, and carousel posts
- **Story Management**: Create and manage Facebook stories
- **Analytics**: View post performance (if available)
- **Account Settings**: Manage profile and connections

#### Dashboard Layout:
```
┌─────────────────────────────────────────────────┐
│                 Header/Nav                      │
├─────────────────┬───────────────────────────────┤
│   Sidebar       │        Main Content           │
│   - Pages       │   ┌─────────────────────────┐ │
│   - Create Post │   │     Active Feature      │ │
│   - Stories     │   │                         │ │
│   - Analytics   │   │                         │ │
│   - Settings    │   │                         │ │
│                 │   └─────────────────────────┘ │
└─────────────────┴───────────────────────────────┘
```

## Implementation Guide

### 1. Route Structure
```
/                    - Landing page
/login              - Login form
/signup             - Registration form
/connect-facebook   - Facebook OAuth initiation
/dashboard          - Main application (protected)
/dashboard/posts    - Post management
/dashboard/stories  - Story management
/dashboard/settings - User settings
```

### 2. Protected Routes
```typescript
// middleware.ts or route protection
const protectedRoutes = ['/dashboard', '/connect-facebook'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### 3. State Management
```typescript
// Context for user state
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  hasFacebookToken: boolean;
  facebookPages: FacebookPage[];
}

// Actions
type AppAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'FACEBOOK_CONNECTED'; payload: FacebookPage[] }
  | { type: 'FACEBOOK_DISCONNECTED' };
```

### 4. Key Components

#### AuthGuard Component
```typescript
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

#### FacebookTokenChecker
```typescript
const FacebookTokenChecker = ({ children }: { children: React.ReactNode }) => {
  const { hasFacebookToken, loading } = useFacebook();
  
  if (loading) return <LoadingSpinner />;
  if (!hasFacebookToken) return <Navigate to="/connect-facebook" />;
  
  return <>{children}</>;
};
```

## Error Handling

### Common Scenarios:
1. **Invalid Login**: Show error message, allow retry
2. **Facebook OAuth Failure**: Redirect back to connect page with error
3. **Token Expiry**: Auto-logout and redirect to login
4. **Network Issues**: Show retry options

### Error States:
```typescript
interface ErrorState {
  type: 'auth' | 'facebook' | 'network' | 'validation';
  message: string;
  retryable: boolean;
}
```

## Security Considerations

1. **Token Storage**: Store JWT in httpOnly cookies
2. **CSRF Protection**: Implement CSRF tokens for state-changing operations
3. **Rate Limiting**: Implement on both frontend and backend
4. **Input Validation**: Validate all user inputs
5. **Secure Redirects**: Validate OAuth callback URLs

## Environment Configuration

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://backend.postsiva.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Testing the Flow

### Manual Testing Steps:
1. Visit landing page
2. Click "Login" → should redirect to login form
3. Enter valid credentials → should check Facebook token
4. If no Facebook token → should redirect to connect page
5. Click "Connect Facebook" → should initiate OAuth
6. Complete Facebook OAuth → should redirect to dashboard
7. Verify dashboard shows Facebook pages

### Test Credentials:
- Email: `uzair1@postiva.com`
- Password: `123123123`

## Next Steps

1. Implement the user journey flow in your Next.js app
2. Create the necessary pages and components
3. Set up state management (Context API or Zustand)
4. Implement route protection
5. Add error handling and loading states
6. Test the complete flow end-to-end
