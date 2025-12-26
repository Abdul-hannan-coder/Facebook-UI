/**
 * API Client for backend communication
 * Uses Next.js API routes to avoid CORS issues
 */

const BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com');

export interface APIError {
  detail: string | Array<{
    type: string;
    loc: string[];
    msg: string;
    input: unknown;
  }>;
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error: APIError = await response.json().catch(() => ({
        detail: `API Error: ${response.status} ${response.statusText}`,
      }));
      throw error;
    }

    return response.json();
  }

  // Auth methods - use Next.js API routes to avoid CORS
  async login(email: string, password: string) {
    return this.request<{
      access_token: string;
      token_type: 'bearer';
      user: {
        email: string;
        username: string;
        full_name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        id: string;
      };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: {
    email: string;
    username: string;
    full_name: string;
    password: string;
  }) {
    return this.request<{
      access_token: string;
      token_type: 'bearer';
      user: {
        email: string;
        username: string;
        full_name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        id: string;
      };
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient();

export const handleAPIError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'detail' in error) {
    const apiError = error as APIError;
    if (apiError.detail) {
      if (Array.isArray(apiError.detail)) {
        return apiError.detail.map((e) => e.msg).join(', ');
      }
      return String(apiError.detail);
    }
  }
  return 'An unexpected error occurred';
};
