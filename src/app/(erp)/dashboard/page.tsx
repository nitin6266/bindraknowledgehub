import { getUserRole } from "@/lib/auth/role";
import { ROLE_DEFAULT_DASHBOARD } from "@/constants/roles";
import { redirect } from "next/navigation";

export default async function DashboardHomePage() {
  const role = await getUserRole();

  if (role) {
    redirect(ROLE_DEFAULT_DASHBOARD[role]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-semibold text-foreground">Dashboard</h1>
        <p className="text-body text-muted-foreground">
          Welcome to the Bindra Knowledge Hub ERP.
        </p>
      </div>
    </div>
  );
}
