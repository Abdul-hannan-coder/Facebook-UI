"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFacebook } from "@/hooks/facebook";
import { AuthGuard } from "@/components/AuthGuard";

export default function FacebookCallbackPage() {
  const router = useRouter();
  const { checkToken } = useFacebook();
  const [status, setStatus] = useState<
    "processing" | "success" | "error"
  >("processing");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Backend should handle the callback automatically
        // Wait a moment for backend to process, then check token status
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkToken();
        
        // Check again after a short delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const hasToken = await checkToken();
        
        if (hasToken) {
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Callback processing error:", error);
        setStatus("error");
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGuard>
      <div className="flex items-center justify-center min-h-screen bg-white">
        {status === "processing" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Processing Facebook Connection
            </h2>
            <p className="text-slate-600">Please wait while we connect your account...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Facebook Connected Successfully!
            </h2>
            <p className="text-slate-600 mb-6">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Connection Failed
            </h2>
            <p className="text-slate-600 mb-6">
              We couldn&apos;t connect your Facebook account. Please try again.
            </p>
            <button
              onClick={() => router.push("/connect-facebook")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

