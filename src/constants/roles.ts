export type UserRole = "owner" | "admin" | "manager" | "member" | "viewer";

export const ROLES: Record<UserRole, { label: string; description: string }> = {
  owner: {
    label: "Owner",
    description: "Full administrative access including workspace deletion and billing",
  },
  admin: {
    label: "Admin",
    description: "Full workspace configuration and member management access",
  },
  manager: {
    label: "Manager",
    description: "Manage assistants, knowledge bases, and team workflows",
  },
  member: {
    label: "Member",
    description: "Access AI assistants and chat within authorized workspaces",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to chat logs and analytics",
  },
};
