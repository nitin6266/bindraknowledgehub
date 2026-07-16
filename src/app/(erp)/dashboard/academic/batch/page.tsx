import { assertRole, getCurrentRole } from "@/lib/auth/authorize";
import { createClient } from "@/lib/supabase/server";
import { batchRepository } from "@/repositories/batch.repository";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { userRepository } from "@/repositories/user.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import { BATCH_VIEW_ROLES, canManageBatch } from "@/features/batch/batch.constants";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";
import { BatchListClient } from "@/features/batch/components/batch-list-client";
import type { Option } from "@/features/batch/batch.types";

export const metadata = {
  title: "Batch Management | Bindra Knowledge Hub ERP",
};

export const dynamic = "force-dynamic";

async function toOptions(module: MasterModuleKey): Promise<Option[]> {
  const rows = await masterDataRepository.list(module);
  const key = nameKeyFor(module);
  return rows.map((r) => ({ value: String(r.id), label: String(r[key] ?? "") }));
}

export default async function BatchListPage() {
  await assertRole(BATCH_VIEW_ROLES);
  const role = await getCurrentRole();
  const canManage = canManageBatch(role);

  let teacherScopeId: string | undefined;
  if (role === "TEACHER") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const me = await userRepository.getByAuthId(user.id);
      teacherScopeId = me?.id;
    }
  }

  const [batches, sessions, classes, sections, batchTypes, users] = await Promise.all([
    batchRepository.list({}, { teacherScopeId }),
    toOptions("academic-session"),
    toOptions("class"),
    toOptions("section"),
    toOptions("batch-type"),
    userRepository.list(),
  ]);

  const teachers: Option[] = users
    .filter((u) => u.role.name === "TEACHER")
    .map((u) => ({
      value: u.id,
      label: `${u.profile?.firstName ?? ""} ${u.profile?.lastName ?? ""}`.trim() || u.email,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-semibold text-foreground">Batch Management</h1>
        <p className="text-body text-muted-foreground">
          Create and manage academic batches, their schedules, teachers and subjects.
        </p>
      </div>

      <BatchListClient
        batches={batches}
        options={{ sessions, classes, sections, batchTypes, teachers }}
        canManage={canManage}
      />
    </div>
  );
}
