import { supabaseAdmin } from "./admin";
import { sendWelcomeEmail } from "@/lib/email";

export async function getOrCreateProfile(
  clerkUserId: string,
  email?: string | null,
  fullName?: string | null
) {
  // Try to get existing profile
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) return existing;

  // Create profile on first login
  const { data: created, error } = await supabaseAdmin
    .from("profiles")
    .insert({
      clerk_user_id: clerkUserId,
      email:         email    ?? null,
      full_name:     fullName ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);

  // Send welcome email on first sign-up (fire and forget)
  if (email) {
    sendWelcomeEmail({
      to:   email,
      name: fullName?.split(" ")[0] ?? "there",
    }).catch((e) => console.error("Welcome email failed:", e));
  }

  return created;
}
