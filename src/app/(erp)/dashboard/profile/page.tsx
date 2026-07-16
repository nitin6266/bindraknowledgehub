import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { userService } from "@/services/user.service";
import { ProfileView } from "@/features/profile/components/profile-view";
import { type Role } from "@/constants/roles";

export const metadata = {
  title: "My Profile | Bindra Knowledge Hub ERP",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const local = await userService.getByAuthId(authUser.id);

  if (!local) {
    return (
      <div className="space-y-4">
        <h1 className="text-h3 font-semibold text-foreground">My Profile</h1>
        <p className="text-body text-muted-foreground">
          Your profile has not been set up yet. Please contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <ProfileView
      email={local.email}
      role={local.role.name as Role}
      status={local.status}
      profile={{
        firstName: local.profile?.firstName ?? "",
        lastName: local.profile?.lastName ?? "",
        phone: local.profile?.phone ?? null,
        gender: local.profile?.gender ?? null,
      }}
    />
  );
}
