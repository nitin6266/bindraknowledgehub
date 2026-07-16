import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/erp/database";

export const cookieOptions: CookieOptionsWithName = {
  name: "bkh-erp-session",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore errors thrown from Server Components where cookies are read-only.
          }
        },
      },
      cookieOptions,
    },
  );
}
