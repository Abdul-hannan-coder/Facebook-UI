import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.postsiva.com';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { detail: 'Authorization token required' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const isPopup = body.popup === true;

    const response = await fetch(`${BACKEND_URL}/facebook/create-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // If popup mode, modify the OAuth URL to redirect to popup callback
    if (isPopup && data.oauth_url) {
      const url = new URL(data.oauth_url);
      const redirectUri = url.searchParams.get('redirect_uri');
      
      if (redirectUri) {
        // Modify redirect_uri to point to popup callback
        const redirectUrl = new URL(redirectUri);
        redirectUrl.pathname = '/facebook/popup-callback';
        url.searchParams.set('redirect_uri', redirectUrl.toString());
        data.oauth_url = url.toString();
      } else {
        // If no redirect_uri in URL, try to add state parameter
        // The backend should handle the redirect, but we can add a hint
        url.searchParams.set('popup', 'true');
        data.oauth_url = url.toString();
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Facebook create-token API error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

