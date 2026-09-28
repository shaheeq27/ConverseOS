export const APP_CONFIG = {
  name: "ConverseOS",
  tagline: "The Enterprise AI Operating System",
  version: "0.1.0",
  apiVersion: "v1",
  company: "ConverseOS Platform Inc.",
  supportEmail: "support@converseos.ai",
  defaultUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
