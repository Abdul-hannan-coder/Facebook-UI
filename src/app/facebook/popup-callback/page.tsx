"use client";

import { useEffect, useState } from "react";
import { useFacebook } from "@/hooks/facebook";

export default function FacebookPopupCallbackPage() {
  const { checkToken, fetchPages } = useFacebook();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Wait a moment for backend to process the callback
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Check if token was successfully created
        await checkToken();
        
        // Try to fetch pages to verify connection
        try {
          await fetchPages();
          setStatus("success");
          
          // Notify parent window of success
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "FACEBOOK_OAUTH_SUCCESS",
                payload: { message: "Facebook connected successfully" },
              },
              window.location.origin
            );
            
            // Close popup after a short delay
            setTimeout(() => {
              window.close();
            }, 1500);
          } else {
            // If no opener, redirect to dashboard
            window.location.href = "/dashboard";
          }
        } catch {
          // Token might be valid but pages fetch failed
          setStatus("success");
          
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "FACEBOOK_OAUTH_SUCCESS",
                payload: { message: "Facebook connected successfully" },
              },
              window.location.origin
            );
            
            setTimeout(() => {
              window.close();
            }, 1500);
          }
        }
      } catch (err) {
        console.error("Callback processing error:", err);
        setStatus("error");
        const errorMessage = err instanceof Error ? err.message : "Connection failed";
        setError(errorMessage);
        
        // Notify parent window of error
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "FACEBOOK_OAUTH_ERROR",
              error: errorMessage,
            },
            window.location.origin
          );
          
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {status === "processing" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Connecting to Facebook
          </h2>
          <p className="text-slate-600">Please wait...</p>
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
            Successfully Connected!
          </h2>
          <p className="text-slate-600">This window will close automatically...</p>
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
          <p className="text-slate-600 mb-4">{error || "An error occurred"}</p>
          <p className="text-sm text-slate-500">This window will close automatically...</p>
        </div>
      )}
    </div>
  );
}

