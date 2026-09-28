// Preserve the legacy demo import path without maintaining a second,
// user-ID-cookie authentication implementation.
export {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createDBSession,
  getSessionUser,
  getSessionUserFromRequest,
  revokeDBSession,
} from "@/server/auth/session";
export type { SessionMetadata } from "@/server/auth/session";
