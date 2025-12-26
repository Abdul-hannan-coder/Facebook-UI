"use client";

import { FacebookTokenChecker } from "@/components/FacebookTokenChecker";
import { AuthGuard } from "@/components/AuthGuard";

export default function CheckFacebookPage() {
  return (
    <AuthGuard>
      <FacebookTokenChecker>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying Facebook connection...</p>
          </div>
        </div>
      </FacebookTokenChecker>
    </AuthGuard>
  );
}

