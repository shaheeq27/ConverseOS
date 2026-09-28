import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import UserModel from "@/server/db/models/User";
import {
  createDBSession,
  revokeDBSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/server/auth/session";
import { LoginSchema } from "@/lib/zod/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();
    const user = await UserModel.findOne({
      _id: parsed.data.userId,
      deletedAt: null,
    }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessionToken = await createDBSession(user._id.toString(), {
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    const response = NextResponse.json({
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarColor: user.avatarColor,
      },
    });

    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" && req.nextUrl.protocol === "https:",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await revokeDBSession(token);
  }

  const response = NextResponse.json({ data: { success: true } });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
