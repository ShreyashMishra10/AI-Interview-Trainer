import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/account/sessions/[sessionId] — revoke a specific session
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await params;

  const clerk = await clerkClient();

  const session = await clerk.sessions.getSession(sessionId);
  if (session.userId !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await clerk.sessions.revokeSession(sessionId);
  return NextResponse.json({ success: true });
}
