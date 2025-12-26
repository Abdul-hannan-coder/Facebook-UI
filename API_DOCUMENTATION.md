# FastAPI Backend Documentation

## Base URL
```
https://backend.postsiva.com
```

## Authentication

### Login
**Endpoint:** `POST /auth/login`

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  user: {
    email: string;
    username: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    id: string;
  };
}
```

**Example:**
```javascript
const login = async (email, password) => {
  const response = await fetch('https://backend.postsiva.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

### Signup
**Endpoint:** `POST /auth/signup`

**Request:**
```typescript
interface SignupRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
}
```

## Facebook API Endpoints

### Authentication Headers
All Facebook endpoints require:
```javascript
headers: {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
}
```

### 1. Facebook OAuth
**Endpoint:** `POST /facebook/create-token`
- Initiates Facebook OAuth flow

**Endpoint:** `GET /facebook/oauth/callback`
- Handles OAuth callback

### 2. Get Facebook Pages
**Endpoint:** `GET /facebook/pages`

**Response:**
```typescript
interface FacebookPagesResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    user_id: string;
    pages: Array<{
      page_id: string;
      page_name: string;
      page_access_token: string;
      page_category: string;
      page_permissions: string;
      expires_in: string | null;
      expires_at: string | null;
      created_at: string;
      updated_at: string | null;
    }>;
    count: number;
  };
}
```

### 3. User Profile
**Endpoint:** `GET /facebook/user-profile/`

### 4. Posts Management

#### Get Posts
**Endpoint:** `GET /facebook/posts`

#### Get Single Post
**Endpoint:** `GET /facebook/posts/{post_id}`

#### Update Post
**Endpoint:** `PUT /facebook/posts/{post_id}`

#### Delete Post
**Endpoint:** `DELETE /facebook/posts/{post_id}`

### 5. Create Posts

#### Text Post
**Endpoint:** `POST /facebook/text-post/post`

#### Single Image/Video Post
**Endpoint:** `POST /facebook/single-post/post`

#### Carousel Post
**Endpoint:** `POST /facebook/carousel/post`

#### Video Post
**Endpoint:** `POST /facebook/video/post`

### 6. Stories

#### Get Stories
**Endpoint:** `GET /facebook/stories/`

#### Create Image Story
**Endpoint:** `POST /facebook/stories/image/`

#### Create Video Story
**Endpoint:** `POST /facebook/stories/video/`

## Facebook Ads API

### 1. Ads Authentication
**Endpoint:** `POST /facebook-ads/create-token`
**Endpoint:** `GET /facebook-ads/oauth/callback`

### 2. Account Management
**Endpoint:** `GET /facebook-ads/account/profile`
**Endpoint:** `GET /facebook-ads/businesses`
**Endpoint:** `POST /facebook-ads/businesses/create`
**Endpoint:** `POST /facebook-ads/ad-accounts/create`

### 3. Ad Creation
**Endpoint:** `POST /facebook-ads/image-ads/create`

## Frontend Implementation Examples

### API Client Setup
```typescript
// lib/api.ts
class APIClient {
  private baseURL = 'https://backend.postsiva.com';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: SignupRequest) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Facebook methods
  async getFacebookPages() {
    return this.request('/facebook/pages');
  }

  async getFacebookPosts() {
    return this.request('/facebook/posts');
  }

  async createTextPost(data: any) {
    return this.request('/facebook/text-post/post', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient();
```

### React Hook for Authentication
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.access_token);
      setUser(response.user);
      localStorage.setItem('token', response.access_token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiClient.setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.setToken(token);
      // Optionally verify token validity
    }
    setLoading(false);
  }, []);

  return { user, login, logout, loading };
};
```

### Facebook Pages Component
```typescript
// components/FacebookPages.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export const FacebookPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await apiClient.getFacebookPages();
        setPages(response.data.pages);
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) return <div>Loading pages...</div>;

  return (
    <div>
      <h2>Facebook Pages</h2>
      {pages.map((page) => (
        <div key={page.page_id} className="border p-4 rounded">
          <h3>{page.page_name}</h3>
          <p>Category: {page.page_category}</p>
          <p>Permissions: {page.page_permissions}</p>
        </div>
      ))}
    </div>
  );
};
```

## Error Handling

### Common Error Responses
```typescript
interface APIError {
  detail: string | Array<{
    type: string;
    loc: string[];
    msg: string;
    input: any;
  }>;
}
```

### Error Handler
```typescript
const handleAPIError = (error: any) => {
  if (error.detail) {
    if (Array.isArray(error.detail)) {
      return error.detail.map(e => e.msg).join(', ');
    }
    return error.detail;
  }
  return 'An unexpected error occurred';
};
```

## Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://backend.postsiva.com
```

## Testing Credentials
- Email: `uzair1@postiva.com`
- Password: `123123123`

## Notes
- All endpoints return JSON responses
- Authentication token expires (check `exp` field in JWT)
- Facebook endpoints require valid Facebook OAuth tokens
- File uploads may require `multipart/form-data` content type
- Rate limiting may apply to certain endpoints
