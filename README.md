# Orangeboard

A minimal community app built with React 19, TypeScript, Vite/Rolldown, SWC, React Compiler, and Tailwind CSS v4.

## Run

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm lint
```

The client exposes only authentication and post interactions provided by the API. On app startup it verifies the server-issued session with `GET /auth/me`; protected feed content stays hidden until verification completes. Log out revokes the Redis session. The home feed loads bounded pages from `GET /posts`; creating, editing, and deleting posts, comments, and likes use their corresponding API routes. These requests share the API client with `withCredentials` enabled so the browser sends the HTTP-only session cookie automatically. No sample feed or local mock post data is used.

## Structure

- `src/api`: authentication and post API calls and response normalization.
- `src/store/auth`: login and registration state and request handling.
- `src/app`: authentication screens and separate feed/profile pages.
- `src/components/posts`: post cards, avatars, and post dialogs.
- `src/components/ui`: token-based, accessible primitives with named exports and `data-slot`.

## Custom components

The Base UI registry was not available in this offline workspace, so the initial primitives are local implementations: Button, Input, Textarea, Card, Badge, Label, Separator, Avatar, Alert, Spinner, Skeleton, DropdownMenu, Dialog, Tabs and Checkbox. They use the same token and `cn` conventions and can be replaced one-for-one with generated Base UI components.

## Design decisions

The warm cream canvas, orange logo, restrained borders and generous spacing define the visual style. The compiler is enabled in `vite.config.ts`; no manual memoization is used. Client navigation and authentication are limited to routes currently provided by the API.
