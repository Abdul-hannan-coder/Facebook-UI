'use client';

import Link from 'next/link';
import { Play, Twitter, Youtube, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-300/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-white fill-current">
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.876v-6.987h-2.54V12h2.54v-1.555c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463H15.61c-1.234 0-1.619.766-1.619 1.553V12h2.754l-.44 2.889h-2.314v6.987C18.343 21.127 22 17 22 12"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Postiva
              </span>
            </Link>
            <p className="text-gray-600 max-w-xs text-sm sm:text-base leading-relaxed">
              Accelerate your business with cutting-edge Postsiva tools designed for modern enterprises.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm sm:text-base text-center md:text-left">
            © 2025 Postsiva. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm sm:text-base text-center md:text-right">
            Made with ❤️ for modern businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
