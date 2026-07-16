import { getTeacherProfile } from "@/features/teacher/actions/teacher.actions";
import { TeacherProfileForm } from "@/features/teacher/components/teacher-profile-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TeacherProfilePage() {
  const result = await getTeacherProfile();
  const profile = result.success ? (result.data as never) : null;

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" description="Manage your personal information" />
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Manage your personal information" />
      <TeacherProfileForm profile={profile as never} />
    </div>
  );
}
