export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.postsiva.com';

export const ACCESS_TOKEN_KEY = 'postsiva_access_token';
export const USER_INFO_KEY = 'postsiva_user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function setUserInfo(user: unknown | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_INFO_KEY);
  }
}

export function getUserInfo<T = any>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  { withAuth }: { withAuth?: boolean } = {},
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const headers = new Headers(options.headers || {});
  // If body is FormData, let the browser set Content-Type with boundary
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
  }

  if (withAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as any)?.detail || (data as any)?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

