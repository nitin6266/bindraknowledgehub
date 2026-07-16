import { createClient } from "@/lib/supabase/server";
import { AuthProvider } from "@/providers/auth-provider";

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen" id="main">
      <AuthProvider initialUser={user}>{children}</AuthProvider>
    </div>
  );
}
