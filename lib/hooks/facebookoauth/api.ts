import { apiFetch } from '../../apiClient';
import type { FacebookPagesResponse } from './types';

interface CreateTokenResponse {
  success: boolean;
  message: string;
  user_id: string;
  auth_url: string;
}

export async function createFacebookAuthUrl(): Promise<string> {
  const data = await apiFetch<CreateTokenResponse>(
    '/facebook/create-token',
    {
      method: 'POST',
    },
    { withAuth: true },
  );

  if (!data.success || !data.auth_url) {
    throw new Error(data.message || 'Failed to create Facebook auth URL');
  }

  return data.auth_url;
}

export async function fetchFacebookPages(): Promise<FacebookPagesResponse> {
  const data = await apiFetch<FacebookPagesResponse>(
    '/facebook/pages',
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  return data;
}

export async function disconnectFacebook(): Promise<void> {
  await apiFetch(
    '/facebook/delete-token',
    {
      method: 'DELETE',
    },
    { withAuth: true },
  );
}

