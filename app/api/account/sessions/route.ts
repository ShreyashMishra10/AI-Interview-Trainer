import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/account/sessions — list all active sessions for current user
export async function GET() {
  const { userId, sessionId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const { data: sessions } = await clerk.sessions.getSessionList({ userId, status: "active" });

  const result = sessions.map((s) => ({
    id: s.id,
    isCurrent: s.id === sessionId,
    lastActiveAt: s.lastActiveAt,
    browserName: s.latestActivity?.browserName ?? null,
    deviceType: s.latestActivity?.deviceType ?? null,
    isMobile: s.latestActivity?.isMobile ?? false,
    city: s.latestActivity?.city ?? null,
    country: s.latestActivity?.country ?? null,
  }));

  result.sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));

  return NextResponse.json(result);
}

// DELETE /api/account/sessions — revoke ALL sessions (sign out everywhere)
export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const { data: sessions } = await clerk.sessions.getSessionList({ userId, status: "active" });

  await Promise.all(sessions.map((s) => clerk.sessions.revokeSession(s.id)));

  return NextResponse.json({ success: true });
}
