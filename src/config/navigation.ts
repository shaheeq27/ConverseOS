export interface NavItemConfig {
  label: string;
  href: (slug: string) => string;
  icon: string;
  adminOnly?: boolean;
}

export const MAIN_NAVIGATION: NavItemConfig[] = [
  {
    label: "Chat",
    href: (slug: string) => `/${slug}/chat`,
    icon: "MessageSquare",
  },
  {
    label: "Dashboard",
    href: (slug: string) => `/${slug}/admin`,
    icon: "LayoutDashboard",
    adminOnly: true,
  },
];
