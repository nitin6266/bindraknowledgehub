import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Database } from "@/types/erp/database";

export const cookieOptions: CookieOptionsWithName = {
  name: "bkh-erp-session",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse = NextResponse.next({
              request,
            });
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
      cookieOptions,
    },
  );

  // Do not run code between createServerClient and here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user, supabase };
}
