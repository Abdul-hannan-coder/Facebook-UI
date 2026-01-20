'use client';

import DashboardLayout from '@/components/dashboard-layout';
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  BarChart3,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import { useFacebookOAuth } from '@/lib/hooks/facebookoauth/useFacebookOAuth';
import { useFacebookPosts } from '@/lib/hooks/facebook/posts/useFacebookPosts';
import { useFacebookUserProfile } from '@/lib/hooks/facebook/userProfile/useFacebookUserProfile';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const { pages } = useFacebookOAuth();
  const { profile } = useFacebookUserProfile({ autoLoad: true });

  const pageList = !pages
    ? []
    : Array.isArray(pages.pages)
    ? pages.pages
    : pages.pages
    ? [pages.pages]
    : [];

  const activePageId = pageList[0]?.page_id ?? null;

  const { posts, reload } = useFacebookPosts({ pageId: activePageId, limit: 20 });

  const fallbackAvatar =
    'https://pbs.twimg.com/profile_images/1953065493281013760/FYrRwkZq_normal.jpg';
  const displayName = profile?.name || 'Learn Ai With Uzair';
  const username = profile?.email || 'user@facebook.com';

  const engagementForPost = (post: any) => {
    const likes = post.engagement?.likes_count ?? 0;
    const comments = post.engagement?.comments_count ?? 0;
    const shares = post.engagement?.shares_count ?? 0;
    const views = likes + comments + shares;
    return { likes, comments, shares, views };
  };

  const totals = posts.reduce(
    (acc, post) => {
      const { likes, comments, views } = engagementForPost(post);
      acc.totalViews += views;
      acc.totalLikes += likes;
      acc.totalComments += comments;
      return acc;
    },
    { totalViews: 0, totalLikes: 0, totalComments: 0 },
  );

  const videoCount = posts.length;
  const avgViews = videoCount ? Math.round(totals.totalViews / videoCount) : 0;
  const avgLikes = videoCount ? Math.round(totals.totalLikes / videoCount) : 0;
  const avgComments = videoCount ? Math.round(totals.totalComments / videoCount) : 0;

  const engagementRate =
    totals.totalViews > 0
      ? (((totals.totalLikes + totals.totalComments) / totals.totalViews) * 100).toFixed(2)
      : '0.00';

  const sortedByViews = [...posts].sort((a, b) => {
    const ea = engagementForPost(a);
    const eb = engagementForPost(b);
    return eb.views - ea.views;
  });

  const topPost = sortedByViews[0] || null;

  const analyticsData = {
    totalViews: totals.totalViews,
    totalLikes: totals.totalLikes,
    totalComments: totals.totalComments,
    avgViews,
    avgLikes,
    avgComments,
    engagementRate,
    videoCount,
    topVideo: topPost
      ? {
          id: topPost.id,
          title: topPost.message || topPost.story || '',
          video_description: topPost.message || topPost.story || '',
          cover_image_url: topPost.full_picture || 'https://via.placeholder.com/400x225?text=Post',
          view_count: engagementForPost(topPost).views,
          like_count: engagementForPost(topPost).likes,
          comment_count: engagementForPost(topPost).comments,
          create_time: topPost.created_time
            ? Math.floor(new Date(topPost.created_time).getTime() / 1000)
            : Math.floor(Date.now() / 1000),
          duration: 0,
        }
      : {
          id: '',
          title: '',
          video_description: '',
          cover_image_url: 'https://via.placeholder.com/400x225?text=Post',
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          create_time: Math.floor(Date.now() / 1000),
          duration: 0,
        },
  };

  const userVideos = posts.map((post) => {
    const eng = engagementForPost(post);
    return {
      id: post.id,
      title: post.message || post.story || '',
      video_description: post.message || post.story || '',
      cover_image_url: post.full_picture || 'https://via.placeholder.com/400x225?text=Post',
      view_count: eng.views,
      like_count: eng.likes,
      comment_count: eng.comments,
      create_time: post.created_time
        ? Math.floor(new Date(post.created_time).getTime() / 1000)
        : Math.floor(Date.now() / 1000),
      duration: 0,
    };
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Photo';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    reload()
      .catch(() => setShowError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-300/40">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Analytics & Insights</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">Performance metrics and video analytics</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600 font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Refresh</span>
              </button>
            </div>

            {/* Error Display */}
            {showError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 text-sm">Failed to load analytics data</span>
                </div>
                <button
                  onClick={() => setShowError(false)}
                  className="text-red-600 hover:text-red-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Last Updated */}
            <p className="text-gray-500 text-xs sm:text-sm">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Analytics Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analyticsData.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-2">Avg: {analyticsData.avgViews.toLocaleString()} per video</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Likes</h3>
              <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analyticsData.totalLikes.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-2">Avg: {analyticsData.avgLikes.toLocaleString()} per video</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Comments</h3>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analyticsData.totalComments.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-2">Avg: {analyticsData.avgComments.toLocaleString()} per video</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Engagement Rate</h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analyticsData.engagementRate}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Likes + Comments / Views</p>
          </div>
        </div>

        {/* Top Performing Video */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Performing Video</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Top
                  </span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-gray-700 text-sm sm:text-base mb-2 line-clamp-2 leading-relaxed">
                  {analyticsData.topVideo.video_description}
                </p>
                <span className="inline-block bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                  {formatDate(analyticsData.topVideo.create_time)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Eye className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {analyticsData.topVideo.view_count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Views</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <Heart className="h-5 w-5 text-pink-600 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {analyticsData.topVideo.like_count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Likes</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <MessageSquare className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {analyticsData.topVideo.comment_count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Comments</p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-300/40 text-sm sm:text-base">
                View Full Analytics
              </button>
            </div>
          </div>
        </div>

        {/* All Videos Analytics */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">All Videos Analytics</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userVideos.map((video, index) => {
                const isTopVideo = index === 0;
                const engagementRate =
                  video.view_count > 0
                    ? ((video.like_count + video.comment_count) / video.view_count * 100).toFixed(1)
                    : '0.0';

                return (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-purple-200"
                  >
                    {/* Video Cover Image */}
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg opacity-50">
                          <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium border border-gray-200">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                      {isTopVideo && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Top Performer</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Video Content */}
                    <div className="p-4 sm:p-5">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                            U
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium text-sm sm:text-base truncate">
                            {userProfile.display_name}
                          </p>
                          <p className="text-gray-500 text-xs sm:text-sm truncate">@{userProfile.username}</p>
                        </div>
                      </div>

                      {/* Video Description */}
                      <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                        {video.video_description}
                      </p>

                      {/* Video Stats */}
                      <div className="space-y-2 mb-3">
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-100">
                            <Eye className="h-4 w-4 mb-1 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-900">{video.view_count.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-500">Views</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-100">
                            <Heart className="h-4 w-4 mb-1 text-pink-600" />
                            <span className="text-xs font-semibold text-gray-900">{video.like_count.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-500">Likes</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-100">
                            <MessageSquare className="h-4 w-4 mb-1 text-purple-600" />
                            <span className="text-xs font-semibold text-gray-900">{video.comment_count.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-500">Comments</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {formatDate(video.create_time)}
                          </span>
                          <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-1 rounded-full font-medium">
                            {engagementRate}% Engagement
                          </span>
                        </div>
                      </div>

                      {/* View Button */}
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md shadow-purple-300/40 text-sm">
                        View Analytics
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

