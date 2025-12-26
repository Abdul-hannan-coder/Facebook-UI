#!/usr/bin/env python3
import requests
import json
from typing import Dict, Any

def authenticate_and_analyze():
    base_url = "https://backend.postsiva.com"
    session = requests.Session()
    
    # Step 1: Authenticate
    print("🔐 Authenticating...")
    auth_data = {
        "email": "uzair1@postiva.com",
        "password": "123123123"
    }
    
    try:
        response = session.post(f"{base_url}/auth/login", json=auth_data)
        print(f"Auth response status: {response.status_code}")
        
        if response.status_code == 200:
            auth_result = response.json()
            print("✅ Authentication successful!")
            
            # Extract token
            if "access_token" in auth_result:
                token = auth_result["access_token"]
                session.headers.update({"Authorization": f"Bearer {token}"})
                print(f"🔑 Token obtained and set")
            else:
                print("⚠️ No access_token in response, checking response:")
                print(json.dumps(auth_result, indent=2))
        else:
            print(f"❌ Authentication failed: {response.text}")
            return
            
    except Exception as e:
        print(f"Authentication error: {e}")
        return
    
    # Step 2: Test Facebook endpoints
    print("\n📱 Testing Facebook Module Endpoints:")
    
    facebook_endpoints = [
        ("/facebook/get-token", "GET", "Get Facebook token"),
        ("/facebook/pages", "GET", "Get Facebook pages"),
        ("/facebook/user-profile/", "GET", "Get user profile"),
        ("/facebook/posts", "GET", "Get Facebook posts"),
        ("/facebook/stories/", "GET", "Get Facebook stories"),
        ("/facebook-ads/get-token", "GET", "Get Facebook Ads token"),
        ("/facebook-ads/businesses", "GET", "Get Facebook businesses"),
        ("/facebook-ads/account/profile", "GET", "Get Facebook Ads account profile")
    ]
    
    results = {}
    
    for endpoint, method, description in facebook_endpoints:
        print(f"\n🔍 Testing: {description}")
        print(f"   Endpoint: {method} {endpoint}")
        
        try:
            if method == "GET":
                response = session.get(f"{base_url}{endpoint}")
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"   ✅ Success: {json.dumps(data, indent=2)[:200]}...")
                    results[endpoint] = {"status": "success", "data": data}
                except:
                    print(f"   ✅ Success: {response.text[:200]}...")
                    results[endpoint] = {"status": "success", "data": response.text}
            elif response.status_code == 401:
                print("   🔒 Requires authentication/token")
                results[endpoint] = {"status": "auth_required", "message": response.text}
            elif response.status_code == 404:
                print("   ❌ Not found")
                results[endpoint] = {"status": "not_found"}
            else:
                print(f"   ⚠️ Error: {response.text[:100]}")
                results[endpoint] = {"status": "error", "message": response.text}
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")
            results[endpoint] = {"status": "exception", "error": str(e)}
    
    # Step 3: Analyze Facebook OAuth flow
    print("\n🔗 Facebook OAuth Endpoints:")
    oauth_endpoints = [
        ("/facebook/oauth/callback", "GET", "Facebook OAuth callback"),
        ("/facebook-ads/oauth/callback", "GET", "Facebook Ads OAuth callback")
    ]
    
    for endpoint, method, description in oauth_endpoints:
        print(f"\n🔍 Testing: {description}")
        try:
            response = session.get(f"{base_url}{endpoint}")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print(f"   Response: {response.text[:200]}...")
        except Exception as e:
            print(f"   Error: {e}")
    
    # Save results
    with open("facebook_analysis.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Analysis complete! Results saved to facebook_analysis.json")
    return results

if __name__ == "__main__":
    authenticate_and_analyze()
