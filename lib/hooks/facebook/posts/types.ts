export interface FacebookPostEngagement {
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
}

export interface FacebookPost {
  id: string;
  message?: string | null;
  story?: string | null;
  created_time?: string | null;
  updated_time?: string | null;
  permalink_url?: string | null;
  full_picture?: string | null;
  type?: string | null;
  engagement?: FacebookPostEngagement | null;
}

export interface FacebookPostsResponse {
  success: boolean;
  message: string;
  data: FacebookPost[];
  paging?: any;
  source?: string;
}

