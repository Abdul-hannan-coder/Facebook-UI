'use client';

import DashboardLayout from '@/components/dashboard-layout';
import Link from 'next/link';
import { Image, Video, FileText, Upload as UploadIcon, ArrowRight } from 'lucide-react';

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
            <p className="text-gray-600 text-sm sm:text-base">Choose the type of content you want to create and share</p>
          </div>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Image + Text Post */}
          <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-300/40">
                <Image className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Image + Caption</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Create engaging posts with images and captions. Perfect for sharing photos, infographics, and visual content.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Image className="h-4 w-4" />
                <span className="text-sm">Upload images</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Write captions</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <UploadIcon className="h-4 w-4" />
                <span className="text-sm">Schedule posts</span>
              </div>
            </div>

            <Link
              href="/dashboard/upload/image-text"
              className="flex w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-300/40 items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>Create Image Post</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Video + Text Post */}
          <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-300/40">
                <Video className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Video + Caption</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Share videos with engaging descriptions. Ideal for tutorials, announcements, and dynamic content.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Video className="h-4 w-4" />
                <span className="text-sm">Upload videos</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Add descriptions</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <UploadIcon className="h-4 w-4" />
                <span className="text-sm">Schedule posts</span>
              </div>
            </div>

            <Link
              href="/dashboard/upload/video-text"
              className="flex w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-300/40 items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>Create Video Post</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">12</div>
            <p className="text-gray-600 text-sm sm:text-base">Posts Created</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8</div>
            <p className="text-gray-600 text-sm sm:text-base">Scheduled</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">156</div>
            <p className="text-gray-600 text-sm sm:text-base">Total Views</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

