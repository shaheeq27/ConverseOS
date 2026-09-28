export const RESERVED_SLUGS = [
  "admin",
  "api",
  "app",
  "www",
  "support",
  "dashboard",
  "settings",
  "login",
  "signup",
  "auth",
  "billing",
  "privacy",
  "terms",
  "help",
  "status",
  "docs",
  "playground",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];
