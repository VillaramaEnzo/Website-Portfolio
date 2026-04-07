import { isIlyPageEnabledClient } from "@/lib/ilyAuth";

export interface RouteConfig {
  path: "/" | "/ily";
  name: string;
  description?: string;
}

const homeRoute: RouteConfig = {
  path: "/",
  name: "Home",
  description: "Main page",
};

const ilyRoute: RouteConfig = {
  path: "/ily",
  name: "ILY",
  description: "Secret page",
};

function getRoutes(): RouteConfig[] {
  return isIlyPageEnabledClient() ? [homeRoute, ilyRoute] : [homeRoute];
}

export function isValidRoute(path: string): boolean {
  return getRoutes().some((route) => route.path === path);
}

export function getNavigationPath(path: string): string {
  return path;
}

export function getAutocompleteRoutes(query: string): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  const routes = getRoutes();

  if (normalizedQuery === "/") {
    return routes;
  }

  return routes.filter((route) =>
    route.path.toLowerCase().startsWith(normalizedQuery),
  );
}

