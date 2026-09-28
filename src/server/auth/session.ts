import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { SessionUser } from "@/types";
import { connectDB } from "@/server/db/connect";
import UserModel from "@/server/db/models/User";
import SessionModel from "@/server/db/models/Session";

export const SESSION_COOKIE = "converseos_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export async function createDBSession(
  userId: string,
  metadata: SessionMetadata = {}
): Promise<string> {
  await connectDB();
  const sessionToken = `sess_${randomBytes(32).toString("base64url")}`;
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await SessionModel.create({
    sessionToken,
    userId,
    expiresAt,
    ...metadata,
  });

  return sessionToken;
}

async function getSessionUserByToken(token?: string): Promise<SessionUser | null> {
  if (!token) return null;

  await connectDB();
  const session = await SessionModel.findOne({
    sessionToken: token,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) return null;

  const user = await UserModel.findOne({
    _id: session.userId,
    deletedAt: null,
  }).lean();

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    return await getSessionUserByToken(cookieStore.get(SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

export async function getSessionUserFromRequest(
  req: NextRequest
): Promise<SessionUser | null> {
  try {
    return await getSessionUserByToken(req.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

export async function revokeDBSession(token: string): Promise<void> {
  await connectDB();
  await SessionModel.updateOne(
    { sessionToken: token },
    { $set: { revokedAt: new Date() } }
  );
}
