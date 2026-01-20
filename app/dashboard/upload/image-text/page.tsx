'use client';

import DashboardLayout from '@/components/dashboard-layout';
import Link from 'next/link';
import { useState } from 'react';
import { Image, FileText, Calendar, Clock, Upload, ArrowLeft, Send } from 'lucide-react';

export default function ImageTextPostPage() {
  const [formData, setFormData] = useState({
    text: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no functionality
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100">
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-white">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Image + Text Post</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Upload images and write engaging captions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Image className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Upload Images</h2>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center hover:border-blue-500 transition-colors bg-gray-50">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 mb-2 font-medium">Drag and drop images here</p>
              <p className="text-gray-500 text-sm mb-4">or click to browse</p>
              <button className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition">
                Choose Files
              </button>
            </div>

            {/* Image Preview */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Text & Schedule Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Post Content</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Content */}
              <div className="space-y-2">
                <label htmlFor="text" className="text-gray-900 font-medium text-sm sm:text-base">
                  Post Text
                </label>
                <textarea
                  id="text"
                  name="text"
                  placeholder="Write your post caption here..."
                  value={formData.text}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px] bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition resize-y text-sm sm:text-base"
                  required
                />
                <p className="text-gray-500 text-xs sm:text-sm">{formData.text.length}/280 characters</p>
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <label className="text-gray-900 font-medium flex items-center space-x-2 text-sm sm:text-base">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Post</span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="scheduledDate" className="text-gray-600 text-xs sm:text-sm">
                      Date
                    </label>
                    <input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      className="w-full h-12 bg-gray-50 rounded-lg px-4 border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="scheduledTime" className="text-gray-600 text-xs sm:text-sm">
                      Time
                    </label>
                    <input
                      id="scheduledTime"
                      name="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      className="w-full h-12 bg-gray-50 rounded-lg px-4 border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-300/40 text-sm sm:text-base"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Now
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition text-sm sm:text-base"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Post Preview</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm sm:text-base">Learn Ai With Uzair</p>
                <p className="text-gray-500 text-xs sm:text-sm">@MuhammadUz1654</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
              {formData.text || 'Your post text will appear here...'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="text-gray-500 text-xs sm:text-sm">
              {formData.scheduledDate && formData.scheduledTime ? (
                <p>Scheduled for: {formData.scheduledDate} at {formData.scheduledTime}</p>
              ) : (
                <p>Posted now</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

