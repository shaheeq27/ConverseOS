import { UserRole } from "./roles";

export type Permission =
  | "workspace:manage"
  | "members:invite"
  | "members:manage"
  | "assistants:create"
  | "assistants:manage"
  | "knowledge:upload"
  | "chat:create"
  | "analytics:view";

export interface MembershipRef {
  role: UserRole;
  deletedAt?: Date | null;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    "workspace:manage",
    "members:invite",
    "members:manage",
    "assistants:create",
    "assistants:manage",
    "knowledge:upload",
    "chat:create",
    "analytics:view",
  ],
  admin: [
    "workspace:manage",
    "members:invite",
    "members:manage",
    "assistants:create",
    "assistants:manage",
    "knowledge:upload",
    "chat:create",
    "analytics:view",
  ],
  manager: [
    "assistants:create",
    "assistants:manage",
    "knowledge:upload",
    "chat:create",
    "analytics:view",
  ],
  member: ["chat:create"],
  viewer: ["analytics:view"],
};

export function can(
  membership: MembershipRef | null | undefined,
  permission: Permission
): boolean {
  if (!membership || membership.deletedAt) return false;
  const permissions = ROLE_PERMISSIONS[membership.role];
  return permissions ? permissions.includes(permission) : false;
}
