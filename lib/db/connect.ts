// Legacy demo imports continue to resolve, while src/server owns the only
// database connection implementation.
export { connectDB } from "@/server/db/connect";
