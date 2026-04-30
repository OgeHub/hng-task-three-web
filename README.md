# Web Portal (HNG Stage Three)

A React + Vite web portal for the Profile API with GitHub OAuth login, cookie-based authentication, CSRF protection, role-aware UI behavior, and profile management pages.

## Backend Base URL

- Production base URL: `https://hng-task-three-production.up.railway.app/api`
- The app reads this from `VITE_API_BASE_URL`.

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set:

```env
VITE_API_BASE_URL=https://hng-task-three-production.up.railway.app/api
```

## Implemented Authentication Flow

- Login button redirects browser to: `/auth/github`
- Backend handles OAuth callback and sets cookie session
- Frontend callback route: `/oauth-success`
  - fetches CSRF token
  - verifies session with `/me`
  - navigates to `/dashboard` on success
- Logout calls: `POST /auth/logout`

## Security Integration

- Cookie auth enabled via `withCredentials: true`
- CSRF header is attached for mutating requests:
  - header: `x-csrf-token`
  - token source: `hng_internship_csrf_token` cookie (fallback to in-memory token)
- Profile API versioning header is applied:
  - `x-api-version: 1`

## Available Pages

- `/login`
- `/oauth-success`
- `/dashboard`
- `/profiles`
- `/profiles/:id`
- `/search`
- `/account`

## Profile Features Implemented

- Profiles list with pagination support
- Name filter support
- Profile detail view
- Search page
- CSV export from profiles
- Admin-only profile creation UI

## Scripts

- `npm run dev` - Start development server
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build

## CI

GitHub Actions workflow is configured at:

- `.github/workflows/ci.yml`

CI runs on push/PR to `main` and executes:

- lint (`npm run lint`)
- test (`npm run test`)
- build (`npm run build`)

## Known Backend Assumptions

The frontend currently assumes the backend provides:

- `GET /auth/github` for OAuth login start
- `GET /api/me` to return current authenticated user
- `GET /api/csrf-token` to return CSRF token payload
- `POST /auth/logout` to clear server-side session/refresh token
- Profile endpoints under `/api/profiles*` that require:
  - `x-api-version: 1`
- CSRF validation for cookie-session requests using:
  - cookie: `hng_internship_csrf_token`
  - header: `x-csrf-token`
