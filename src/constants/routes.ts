export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  workspace: {
    chat: (slug: string) => `/${slug}/chat`,
    chatConversation: (slug: string, id: string) => `/${slug}/chat/${id}`,
    admin: (slug: string) => `/${slug}/admin`,
    settings: (slug: string) => `/${slug}/settings`,
  },
  api: {
    auth: {
      login: "/api/auth/login",
      users: "/api/auth/users",
      me: "/api/auth/me",
    },
    admin: {
      dashboard: "/api/admin/dashboard",
    },
    conversations: "/api/conversations",
    messages: "/api/messages",
  },
} as const;
