import { isIlyPageEnabledClient } from "@/lib/ilyAuth";

type RoutePath = "/" | "/portfolio" | "/ily";

export interface RouteConfig {
  path: RoutePath;
  name: string;
  description?: string;
  isPublic: boolean;
  isSecret?: boolean;
  secretAutocomplete?: boolean;
  keywords?: string[];
  enabled?: () => boolean;
}

const homeRoute: RouteConfig = {
  path: "/",
  name: "Home",
  description: "Main page",
  isPublic: true,
  keywords: ["home", "start", "landing", "main"],
};

const portfolioRoute: RouteConfig = {
  path: "/portfolio",
  name: "Portfolio",
  description: "Expanded portfolio route",
  isPublic: true,
  keywords: ["portfolio", "work", "projects"],
};

const ilyRoute: RouteConfig = {
  path: "/ily",
  name: "ILY",
  description: "Secret route",
  isPublic: false,
  isSecret: true,
  secretAutocomplete: false,
  keywords: ["ily", "love"],
  enabled: isIlyPageEnabledClient,
};

export const routes: RouteConfig[] = [homeRoute, portfolioRoute, ilyRoute];

function isRouteEnabled(route: RouteConfig): boolean {
  if (!route.enabled) return true;
  return route.enabled();
}

function getEnabledRoutes(): RouteConfig[] {
  return routes.filter(isRouteEnabled);
}

export function getPublicRoutes(): RouteConfig[] {
  return getEnabledRoutes().filter((route) => route.isPublic);
}

export function getSecretRoutes(): RouteConfig[] {
  return getEnabledRoutes().filter((route) => route.isSecret);
}

export function findRouteByPath(path: string): RouteConfig | undefined {
  return getEnabledRoutes().find((route) => route.path === path);
}

export function searchRoutes(query: string, includeSecret = false): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const candidateRoutes = includeSecret ? getEnabledRoutes() : getPublicRoutes();

  return candidateRoutes
    .filter((route) => {
      if (route.path.toLowerCase().includes(normalizedQuery)) return true;
      if (route.name.toLowerCase().includes(normalizedQuery)) return true;
      if (route.description?.toLowerCase().includes(normalizedQuery)) return true;
      if (route.keywords?.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))) return true;
      return false;
    })
    .sort((a, b) => {
      const aPath = a.path.toLowerCase();
      const bPath = b.path.toLowerCase();
      const aExact = aPath === normalizedQuery;
      const bExact = bPath === normalizedQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aPath.startsWith(normalizedQuery);
      const bStarts = bPath.startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aPath.localeCompare(bPath);
    });
}

export function isValidRoute(path: string): boolean {
  const normalizedPath = path.trim().toLowerCase();
  return Boolean(findRouteByPath(normalizedPath));
}

export function getNavigationPath(path: string): string {
  return path;
}

export function getAutocompleteRoutes(query: string): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  const publicRoutes = getPublicRoutes();
  const secretRoutes = getSecretRoutes();
  const hintedSecretRoutes = secretRoutes.filter((route) => route.secretAutocomplete);
  const exactMatchSecretRoutes = secretRoutes.filter(
    (route) => !route.secretAutocomplete && route.path.toLowerCase() === normalizedQuery,
  );
  const routesForAutocomplete = [...publicRoutes, ...hintedSecretRoutes, ...exactMatchSecretRoutes];

  if (normalizedQuery === "/") {
    // Only show public routes and explicitly hinted secret routes for bare slash input.
    return [...publicRoutes, ...hintedSecretRoutes];
  }

  const filtered = routesForAutocomplete.filter((route) => {
    const routePath = route.path.toLowerCase();
    if (routePath === normalizedQuery) return true;
    return routePath.startsWith(normalizedQuery);
  });

  return filtered.filter(
    (route, index, arr) => arr.findIndex((candidate) => candidate.path === route.path) === index,
  );
}

