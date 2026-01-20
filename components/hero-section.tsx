'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="pt-20 sm:pb-16 px-4 sm:px-6 bg-white">
      <style>{`
        .grid-background {
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(200, 200, 200, 0.15) 25%, rgba(200, 200, 200, 0.15) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.15) 75%, rgba(200, 200, 200, 0.15) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(200, 200, 200, 0.15) 25%, rgba(200, 200, 200, 0.15) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.15) 75%, rgba(200, 200, 200, 0.15) 76%, transparent 77%, transparent);
          background-size: 40px 40px;
          background-position: 0 0;
        }
        @media (min-width: 768px) {
          .grid-background {
            background-size: 50px 50px;
          }
        }
      `}</style>

      <div className="max-w-8xl mx-auto grid-background rounded-2xl sm:rounded-3xl py-8 sm:py-12 md:py-6 px-4 sm:px-6 md:px-8">
        {/* Headline */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="text-gray-900">Automate Your Facebook</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Marketing with AI-Powered Tools
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Save time and boost engagement with intelligent Facebook automation. Schedule posts, manage ads, analyze performance, and grow your audience—all from one powerful platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 md:mb-16">
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 transition font-medium flex items-center justify-center gap-2">
            <Play size={18} />
            Watch Demo
          </button>
          <a
            href="/login"
            className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-medium text-center"
          >
            Start Free Trial
          </a>
        </div>

        {/* Dashboard Image */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/dashboard3.png.png"
              alt="Dashboard Preview"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
