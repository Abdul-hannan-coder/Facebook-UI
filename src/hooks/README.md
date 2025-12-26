# Custom Hooks Structure

This directory contains custom React hooks organized by feature.

## Folder Structure

```
hooks/
├── auth/
│   ├── types.ts          # TypeScript types and interfaces
│   ├── reducers.ts       # State reducer for auth
│   ├── api.ts            # API functions for auth
│   ├── index.ts          # Main useAuth hook
│   ├── example.tsx       # Example usage component
│   └── README.md         # Feature-specific documentation
└── README.md             # This file
```

## Pattern

Each feature hook follows this structure:

1. **types.ts** - All TypeScript types, interfaces, and type definitions
2. **reducers.ts** - State management reducer (if using useReducer)
3. **api.ts** - API functions and backend communication
4. **index.ts** - Main hook implementation that exports the hook

## Available Hooks

### Auth Hook (`useAuth`)

Custom hook for authentication management.

**Location:** `hooks/auth/index.ts`

**Usage:**
```typescript
import { useAuth } from '@/hooks/auth';

const { login, signup, logout, user, isAuthenticated, isLoading, error } = useAuth();
```

See `hooks/auth/README.md` for detailed documentation.

### Facebook Hook (`useFacebook`)

Custom hook for Facebook integration and OAuth management.

**Location:** `hooks/facebook/index.ts`

**Usage:**
```typescript
import { useFacebook } from '@/hooks/facebook';

const { 
  connectFacebook, 
  pages, 
  isConnected, 
  hasToken,
  fetchPages 
} = useFacebook();
```

See `hooks/facebook/README.md` for detailed documentation.

## Adding New Hooks

To add a new feature hook (e.g., `facebook`):

1. Create a new folder: `hooks/facebook/`
2. Create the required files:
   - `types.ts` - Define all types
   - `reducers.ts` - State reducer (if needed)
   - `api.ts` - API functions
   - `index.ts` - Main hook
   - `README.md` - Documentation
3. Follow the same pattern as the `auth` hook

## Example: Creating a Facebook Hook

```typescript
// hooks/facebook/types.ts
export interface FacebookPage {
  page_id: string;
  page_name: string;
  // ...
}

// hooks/facebook/api.ts
export const facebookAPI = {
  getPages: async () => { /* ... */ },
  // ...
};

// hooks/facebook/index.ts
export const useFacebook = () => {
  // Hook implementation
};
```

