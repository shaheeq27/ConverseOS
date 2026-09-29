import { NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import UserModel from "@/server/db/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const users = await UserModel.find({ deletedAt: null })
      .select("_id name email avatarColor")
      .lean();
    return NextResponse.json({
      data: users.map((u) => ({ ...u, _id: u._id.toString() })),
    });
  } catch (error) {
    console.error("[API_AUTH_USERS] Database error:", error);
    return NextResponse.json(
      { error: "Database connection or query failed." },
      { status: 500 }
    );
  }
}
