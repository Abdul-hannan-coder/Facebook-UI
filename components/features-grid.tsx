'use client';

import { Shield, RefreshCw, Cloud, Share2, ArrowRight } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Facebook Integration',
      description: 'Connect your Facebook pages safely with enterprise-grade security and OAuth authentication.',
    },
    {
      icon: RefreshCw,
      title: 'Auto Post Scheduling',
      description: 'Schedule your Facebook posts in advance and maintain a consistent presence automatically.',
    },
    {
      icon: Cloud,
      title: 'Content Management',
      description: 'Create, edit, and manage all your Facebook content from one centralized dashboard.',
    },
    {
      icon: Share2,
      title: 'Multi-Account Management',
      description: 'Manage multiple Facebook pages and accounts seamlessly from a single platform.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="text-gray-900">Powerful </span>
            <span className="text-purple-600">Facebook Automation</span>
            <span className="text-gray-900"> Features</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto px-4">
            Streamline your Facebook marketing with intelligent automation tools that save time and boost engagement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-50 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">{feature.description}</p>

                {/* Learn More Link */}
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1 sm:gap-2 text-purple-600 font-medium text-sm sm:text-base hover:text-purple-700 transition group"
                >
                  Learn More
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
