#!/usr/bin/env python3
import requests
import json
from typing import Dict, Any

class FastAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.token = None
        
    def get_openapi_schema(self) -> Dict[str, Any]:
        """Fetch OpenAPI schema"""
        try:
            response = self.session.get(f"{self.base_url}/openapi.json")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching OpenAPI schema: {e}")
            return {}
    
    def authenticate(self, email: str, password: str) -> bool:
        """Authenticate and get token"""
        auth_data = {"username": email, "password": password}
        
        try:
            # Try common FastAPI auth endpoints
            for endpoint in ["/auth/login", "/login", "/token", "/api/auth/login"]:
                try:
                    response = self.session.post(f"{self.base_url}{endpoint}", data=auth_data)
                    if response.status_code == 200:
                        data = response.json()
                        if "access_token" in data:
                            self.token = data["access_token"]
                            self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                            print(f"✅ Authenticated via {endpoint}")
                            return True
                except:
                    continue
            
            print("❌ Authentication failed - trying all endpoints")
            return False
            
        except Exception as e:
            print(f"Authentication error: {e}")
            return False
    
    def find_facebook_endpoints(self, schema: Dict[str, Any]) -> list:
        """Find Facebook-related endpoints"""
        facebook_endpoints = []
        
        if "paths" in schema:
            for path, methods in schema["paths"].items():
                if "facebook" in path.lower() or "fb" in path.lower():
                    facebook_endpoints.append({
                        "path": path,
                        "methods": list(methods.keys()),
                        "details": methods
                    })
        
        return facebook_endpoints
    
    def test_endpoint(self, path: str, method: str = "GET", data: Dict = None) -> Dict:
        """Test a specific endpoint"""
        url = f"{self.base_url}{path}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data)
            elif method.upper() == "DELETE":
                response = self.session.delete(url)
            
            return {
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "body": response.text[:500] if response.text else None,
                "success": response.status_code < 400
            }
            
        except Exception as e:
            return {"error": str(e), "success": False}

def main():
    # Initialize tester
    tester = FastAPITester("https://backend.postsiva.com")
    
    print("🔍 Fetching OpenAPI schema...")
    schema = tester.get_openapi_schema()
    
    if schema:
        print(f"✅ Schema loaded - {len(schema.get('paths', {}))} endpoints found")
        
        # Save schema for analysis
        with open("openapi_schema.json", "w") as f:
            json.dump(schema, f, indent=2)
        print("📄 Schema saved to openapi_schema.json")
    
    print("\n🔐 Authenticating...")
    auth_success = tester.authenticate("uzair1@postiva.com", "123123123")
    
    if not auth_success:
        print("❌ Authentication failed, continuing without auth...")
    
    print("\n🔍 Looking for Facebook endpoints...")
    facebook_endpoints = tester.find_facebook_endpoints(schema)
    
    if facebook_endpoints:
        print(f"📱 Found {len(facebook_endpoints)} Facebook-related endpoints:")
        for endpoint in facebook_endpoints:
            print(f"  • {endpoint['path']} - Methods: {endpoint['methods']}")
            
            # Test GET endpoints safely
            for method in endpoint['methods']:
                if method.lower() == 'get':
                    print(f"    Testing GET {endpoint['path']}...")
                    result = tester.test_endpoint(endpoint['path'], 'GET')
                    print(f"    Status: {result.get('status_code', 'Error')}")
    else:
        print("❌ No Facebook endpoints found")
        print("\n📋 All available endpoints:")
        for path in schema.get("paths", {}):
            if any(keyword in path.lower() for keyword in ["social", "post", "media", "share"]):
                print(f"  • {path}")

if __name__ == "__main__":
    main()
