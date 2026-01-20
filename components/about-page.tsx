'use client';

import { Upload, Sparkles, Calendar, BarChart3, Share2, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const purposes = [
    {
      icon: Upload,
      title: 'Post Creation & Management',
      description: 'Create and manage your Facebook posts and content library with ease.',
    },
    {
      icon: Sparkles,
      title: 'AI Content Generation',
      description: 'Automatically generate optimized posts, captions, and visuals using artificial intelligence.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Schedule posts for optimal publishing times based on your audience analytics.',
    },
    {
      icon: Share2,
      title: 'Facebook Integration',
      description: 'Direct integration with Facebook API for seamless content publishing.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track performance metrics and get actionable insights for content optimization.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Optimization',
      description: 'Optimize your Facebook content for growth and engagement.',
    },
  ];

  return (
    <section className="py-6 sm:py-6 md:py-6 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Postsiva</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 leading-relaxed">
              <strong className="text-gray-900">Postsiva is an AI-powered Facebook automation platform</strong> designed to help
              content creators, businesses, and marketing professionals streamline their Facebook workflow.
            </p>
          </div>

          {/* Application Purpose Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
              Our Application Purpose
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {purposes.map((purpose, index) => {
                const Icon = purpose.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-200"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center mb-4 sm:mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100">
                          <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">{purpose.title}</h4>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {purpose.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Postsiva Exists */}
          <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-sm">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
                Why Postsiva Exists
              </h3>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                We help Facebook marketers and businesses save time by automating repetitive tasks while maintaining 
                high-quality, optimized content that performs better on the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

