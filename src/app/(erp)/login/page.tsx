import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/role";
import { ROLE_DEFAULT_DASHBOARD } from "@/constants/roles";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign In | Bindra Knowledge Hub ERP",
  description: "Secure sign in for Bindra Knowledge Hub school management system.",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = await getUserRole();
    redirect(role ? ROLE_DEFAULT_DASHBOARD[role] : "/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-h3 font-semibold tracking-tight text-card-foreground">
            Welcome back
          </h1>
          <p className="text-body text-muted-foreground">
            Sign in to Bindra Knowledge Hub ERP
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-body-sm text-muted-foreground">
          Need help? Contact your system administrator.
        </p>
      </div>
    </main>
  );
}
