import { apiFetch } from '../../../apiClient';
import type { FacebookPostsResponse } from './types';

export interface FetchFacebookPostsParams {
  pageId: string;
  limit?: number;
  forceRefresh?: boolean;
}

export async function fetchFacebookPosts(
  params: FetchFacebookPostsParams,
): Promise<FacebookPostsResponse> {
  const { pageId, limit = 10, forceRefresh = false } = params;

  const search = new URLSearchParams();
  search.set('page_id', pageId);
  search.set('limit', String(limit));
  if (forceRefresh) {
    search.set('force_refresh', 'true');
  }

  const path = `/facebook/posts?${search.toString()}`;

  const data = await apiFetch<FacebookPostsResponse>(
    path,
    {
      method: 'GET',
    },
    { withAuth: true },
  );

  return data;
}

