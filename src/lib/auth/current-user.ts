import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated Supabase user's id, or `null` when unauthenticated.
 * Use inside server components and server actions that need the caller's id.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
