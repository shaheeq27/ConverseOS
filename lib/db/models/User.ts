// Compatibility shim for the legacy demo routes. The canonical User schema
// lives in src/server so only one Mongoose model can be registered for User.
export { default } from "@/server/db/models/User";
export type { IUser, IUserPreferences } from "@/server/db/models/User";
