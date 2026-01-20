'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useFacebookUserProfile } from '@/lib/hooks/facebook/userProfile/useFacebookUserProfile';
import { useFacebookOAuth } from '@/lib/hooks/facebookoauth/useFacebookOAuth';
import { useFacebookPosts } from '@/lib/hooks/facebook/posts/useFacebookPosts';
import { useFacebookToken } from '@/lib/hooks/facebook/token/useFacebookToken';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Eye,
  ArrowUp,
} from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const { hasToken, loading: tokenLoading } = useFacebookToken();

  useEffect(() => {
    if (!tokenLoading && !hasToken) {
      router.replace('/connect-facebook');
    }
  }, [tokenLoading, hasToken, router]);

  const { profile, loading: profileLoading, error: profileError } = useFacebookUserProfile();
  const { pages } = useFacebookOAuth();

  // Normalize pages list from backend response (can be object or array)
  const pageList = !pages
    ? []
    : Array.isArray(pages.pages)
    ? pages.pages
    : pages.pages
    ? [pages.pages]
    : [];

  const activePageId = pageList[0]?.page_id ?? null;

  const { posts } = useFacebookPosts({ pageId: activePageId, limit: 3 });

  // Map Facebook posts into the existing "tweets" shape the UI expects
  const tweets = posts.map((post) => {
    const likes = post.engagement?.likes_count ?? 0;
    const comments = post.engagement?.comments_count ?? 0;
    const shares = post.engagement?.shares_count ?? 0;
    const impressions = likes + comments + shares;
    return {
      id: post.id,
      text: post.message || post.story || '',
      created_at: post.created_time || '',
      duration: 0,
      type: post.type || 'post',
      public_metrics: {
        retweet_count: shares,
        reply_count: comments,
        like_count: likes,
        quote_count: 0,
        impression_count: impressions,
      },
    };
  });

  const fallbackAvatar =
    'https://pbs.twimg.com/profile_images/1953065493281013760/FYrRwkZq_normal.jpg';
  const profileAvatar = profile?.profile_picture_url || fallbackAvatar;
  const displayName = profile?.name || 'Learn Ai With Uzair';
  const username = profile?.email || 'user@facebook.com';

  const metrics = {
    followers_count: pages?.count ?? 0,
    following_count: 0,
    tweet_count: posts.length,
    listed_count: 0,
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Photo';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      {/* Responsive container */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6">
        {/* Profile section */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-2xl py-6 px-4 sm:py-8 sm:px-8 border border-gray-100 flex flex-col sm:flex-row items-center gap-4 relative">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <Image
              src={profileAvatar}
              alt={displayName}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 96px, 112px"
            />
          </div>
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              {profileLoading ? 'Loading profile...' : profile?.name ?? 'Connect Facebook'}
            </h1>
            {profile && (
              <>
                <p className="text-purple-700 font-medium text-md md:text-lg">
                  {profile.email ?? ''}
                </p>
                <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-xl">
                  {profile.about ?? 'Your Facebook about/bio will appear here.'}
                </p>
              </>
            )}
            {profileError && (
              <p className="text-red-600 text-sm mt-2">
                {profileError} (make sure Facebook is connected)
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {pages?.count ?? 0}
            </div>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Connected Pages</span>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.following_count}</div>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Following</span>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.tweet_count}</div>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Posts</span>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.listed_count}</div>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Listed</span>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl p-3 sm:p-5 md:p-6 border border-gray-100 shadow-sm w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center sm:text-left">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {tweets.map((tweet, index) => {
              const isTopPerformer = index === 0;
              return (
                <div
                  key={tweet.id}
                  className="bg-white rounded-lg border border-gray-100 hover:border-purple-300 hover:shadow-lg transition duration-300 flex flex-col h-full overflow-hidden"
                >
                  {/* Thumbnail / badge */}
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                        <TrendingUp className="h-7 w-7 md:h-9 md:w-9 text-white drop-shadow" />
                      </div>

                      {/* Top performer badge */}
                      {isTopPerformer && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded shadow flex items-center gap-1">
                          <ArrowUp className="h-4 w-4" />
                          <span>Top Perf.</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                        {formatDuration(tweet.duration)}
                      </div>
                    </div>
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow">
                      <Image
                        src={profileAvatar}
                        alt={displayName}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-gray-900 font-bold text-sm truncate">{displayName}</span>
                      <span className="block text-gray-500 text-xs truncate">@{username}</span>
                    </div>
                  </div>

                  {/* Tweet text */}
                  <div className="flex-1 px-3 py-2 flex flex-col gap-1">
                    <span className="text-gray-800 font-medium text-sm line-clamp-2">
                      {tweet.text.split('https://')[0].trim()}
                    </span>
                    {tweet.text.includes('https://') && (
                      <span className="text-blue-600 text-xs truncate">
                        {tweet.text.split('https://')[1]?.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 px-3 py-2 bg-white">
                    <div className="flex flex-col items-center">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <span className="text-xs font-semibold">{tweet.public_metrics.impression_count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">Views</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span className="text-xs font-semibold">{tweet.public_metrics.like_count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">Likes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <span className="text-xs font-semibold">{tweet.public_metrics.reply_count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">Comments</span>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow mt-2 text-xs md:text-sm">
                      View Analytics
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
