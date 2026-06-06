# Command Center Routes Guide (`blank`)

This guide explains how route navigation works in the Command Center, and how to add or manage public vs secret routes.

## Where route behavior lives

- Route model and helper functions: `blank/app/utils/routes.ts`
- Command Center route usage: `blank/app/hooks/useCommandCenter.ts`
- UI for route suggestions and messaging: `blank/app/components/widgets/CommandCenter.tsx`
- `/ily` feature toggle helpers: `blank/lib/ilyAuth.ts`

## How Command Center route navigation works

In `useCommandCenter`, route handling is triggered when input starts with `/`.

High-level flow:
1. `getAutocompleteRoutes(query)` provides suggestion list.
2. On `Enter`, `handleNavigate(path)` runs.
3. `isValidRoute(path)` checks route validity.
4. `router.push(getNavigationPath(path))` performs navigation.

Important behavior:
- If route input is invalid, Command Center closes gracefully.
- Route-like input does **not** fall back to Google search.

## Route model in `routes.ts`

Each route uses:

```ts
export interface RouteConfig {
  path: "/" | "/portfolio" | "/ily";
  name: string;
  description?: string;
  isPublic: boolean;
  isSecret?: boolean;
  secretAutocomplete?: boolean;
  keywords?: string[];
  enabled?: () => boolean;
}
```

Field meanings:
- `isPublic`: shown in normal Command Center route suggestions.
- `isSecret`: route is hidden from normal suggestions by default.
- `secretAutocomplete`: if `true`, allows secret route to appear in suggestions.
- `enabled`: runtime guard (feature flag). If this returns `false`, route is treated as unavailable.

## Public vs secret routes

Current `blank` routes:
- Public: `/`, `/portfolio`
- Secret: `/ily` (gated)

By default:
- Public routes are included in autocomplete suggestions.
- Secret routes are valid only when enabled and entered exactly.
- Secret routes can behave in two modes:
  - `secretAutocomplete: false` (exact-only): hidden for prefix typing, but shown as a valid selectable option when the full route is typed exactly.
  - `secretAutocomplete: true` (autocomplete-visible): shown in dropdown suggestions while typing route prefixes.

For `/ily` (current default secret route behavior):
- Typing `/i` does **not** show `/ily` in the dropdown.
- Typing `/ily` **does** show `/ily` as a valid selectable option (when enabled).
- Pressing `Enter` executes navigation only when the route is enabled.

## `/ily` toggle on/off

`/ily` is gated with:

```ts
enabled: isIlyPageEnabledClient
```

`isIlyPageEnabledClient()` reads:
- `NEXT_PUBLIC_ILY_PAGE_ENABLED`

Server-side route protection also uses:
- `ILY_PAGE_ENABLED`

Recommended setup (keep both flags aligned):

```bash
ILY_PAGE_ENABLED=true
NEXT_PUBLIC_ILY_PAGE_ENABLED=true
```

Turn off `/ily` everywhere:

```bash
ILY_PAGE_ENABLED=false
NEXT_PUBLIC_ILY_PAGE_ENABLED=false
```

When OFF:
- `/ily` is removed from enabled route checks in Command Center.
- Server route guards should redirect `/ily` access.

## How to add a new public route

In `blank/app/utils/routes.ts`, add a route object:

```ts
const blogRoute: RouteConfig = {
  path: "/blog",
  name: "Blog",
  description: "Articles and notes",
  isPublic: true,
  keywords: ["blog", "posts", "writing"],
};
```

Then include it in `routes`:

```ts
export const routes: RouteConfig[] = [homeRoute, portfolioRoute, blogRoute, ilyRoute];
```

## How to add a new secret route

Add route config:

```ts
const vaultRoute: RouteConfig = {
  path: "/vault",
  name: "Vault",
  description: "Hidden area",
  isPublic: false,
  isSecret: true,
  secretAutocomplete: false, // keep hidden by default
  keywords: ["vault", "hidden"],
  enabled: () => process.env.NEXT_PUBLIC_ENABLE_VAULT === "true",
};
```

Then include it in `routes`.

## Optional secret autocomplete hints

If you want a secret route to appear in suggestions:

```ts
secretAutocomplete: true
```

`getAutocompleteRoutes()` includes:
- all public routes
- secret routes where `secretAutocomplete === true` for prefix matching
- exact-match secret routes even when `secretAutocomplete === false`

## Secret route mode examples

Exact-only secret route:

```ts
const ilyRoute: RouteConfig = {
  path: "/ily",
  name: "ILY",
  isPublic: false,
  isSecret: true,
  secretAutocomplete: false, // hidden for prefix typing
  enabled: isIlyPageEnabledClient,
};
```

Autocomplete-visible secret route:

```ts
const vaultRoute: RouteConfig = {
  path: "/vault",
  name: "Vault",
  isPublic: false,
  isSecret: true,
  secretAutocomplete: true, // appears for prefix typing
  enabled: () => process.env.NEXT_PUBLIC_ENABLE_VAULT === "true",
};
```

## Helper functions you should use

Use these from `routes.ts`:
- `getPublicRoutes()`
- `getSecretRoutes()`
- `findRouteByPath(path)`
- `searchRoutes(query, includeSecret?)`
- `isValidRoute(path)`
- `getNavigationPath(path)`
- `getAutocompleteRoutes(query)`

Prefer calling helpers instead of duplicating route checks inside hooks/components.

## Quick verification checklist

After route changes:
1. Type `/` in Command Center and confirm public suggestions.
2. Type `/i` and confirm exact-only secret routes are still hidden.
3. Type a full secret path (for example `/ily`) and confirm it appears as selectable.
4. Press `Enter` and confirm navigation works only when enabled.
5. Confirm disabled secret route is rejected when flag is off.
6. If `secretAutocomplete` is enabled on a secret route, confirm it appears during prefix typing.
