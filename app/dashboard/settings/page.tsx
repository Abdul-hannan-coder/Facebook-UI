'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Key, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKey = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSaveDialog(false);
    }, 1000);
  };

  const handleRemoveKey = () => {
    setGeminiKey('');
    setShowRemoveDialog(false);
  };

  const handleDisconnectFacebook = () => {
    // UI only - no functionality
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your account settings and API keys</p>
        </div>

        {/* Gemini API Key Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Key className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gemini API Key</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <label htmlFor="gemini-key" className="text-gray-900 font-medium text-sm sm:text-base">
                API Key
              </label>
              <input
                id="gemini-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full h-12 bg-gray-50 rounded-lg px-4 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Your API key is stored locally and used to generate content with Gemini AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowSaveDialog(true)}
                disabled={isLoading || !geminiKey.trim()}
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-300/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Key'}
              </button>

              {geminiKey && (
                <button
                  onClick={() => setShowRemoveDialog(true)}
                  className="flex items-center justify-center border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm sm:text-base"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Key
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Facebook Connection Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Facebook Connection</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 font-medium text-sm sm:text-base truncate">@MuhammadUz1654</p>
                  <p className="text-gray-500 text-xs sm:text-sm">Connected</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-600 shrink-0">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium">Active</span>
              </div>
            </div>

            <button
              onClick={() => handleDisconnectFacebook()}
              className="w-full flex items-center justify-center border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Disconnect from Facebook
            </button>
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Save Gemini API Key?</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                This will save your Gemini API key locally. Make sure you've entered the correct key.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition text-sm sm:text-base"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Dialog */}
        {showRemoveDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Remove Gemini API Key?</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                This will permanently remove your saved Gemini API key. You'll need to enter it again to use Gemini features.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowRemoveDialog(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveKey}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition text-sm sm:text-base"
                >
                  Remove Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

