import { PageHeader } from "@/components/page-header";

import { getParentProfile } from "@/features/parent/actions/parent.actions";
import { ParentProfileForm } from "@/features/parent/components/parent-profile-form";

export const dynamic = "force-dynamic";

export default async function ParentProfilePage() {
  const res = await getParentProfile();
  const profile = res.success ? res.data : null;

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Update your contact details" />
      {profile ? (
        <ParentProfileForm
          initial={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            gender: profile.gender,
            email: profile.email,
          }}
        />
      ) : (
        <p className="text-body text-muted-foreground">Could not load your profile.</p>
      )}
    </div>
  );
}
