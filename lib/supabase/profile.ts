import { supabaseAdmin } from "./admin";

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
  return created;
}
