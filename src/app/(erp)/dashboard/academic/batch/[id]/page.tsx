import Link from "next/link";
import { notFound, forbidden } from "next/navigation";

import { assertRole, getCurrentRole } from "@/lib/auth/authorize";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/database/prisma";
import { batchRepository } from "@/repositories/batch.repository";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { userRepository } from "@/repositories/user.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import { BATCH_VIEW_ROLES } from "@/features/batch/batch.constants";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";
import { BatchDetailClient } from "@/features/batch/components/batch-detail-client";
import type { Option } from "@/features/batch/batch.types";

export const dynamic = "force-dynamic";

async function toOptions(module: MasterModuleKey): Promise<Option[]> {
  const rows = await masterDataRepository.list(module);
  const key = nameKeyFor(module);
  return rows.map((r) => ({ value: String(r.id), label: String(r[key] ?? "") }));
}

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await assertRole(BATCH_VIEW_ROLES);
  const role = await getCurrentRole();

  const batch = await batchRepository.getDetail(id);
  if (!batch) {
    notFound();
  }

  if (role === "TEACHER") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const me = user ? await userRepository.getByAuthId(user.id) : null;
    if (me) {
      const assigned = await prisma.batchTeacher.findFirst({
        where: { batchId: id, teacherId: me.id, unassignedAt: null },
      });
      if (!assigned) {
        forbidden();
      }
    }
  }

  const canManage = role === "SUPER_ADMIN" || role === "ADMIN";

  const [teachers, subjects, timeSlots] = await Promise.all([
    (async () => {
      const users = await userRepository.list();
      return users
        .filter((u) => u.role.name === "TEACHER")
        .map((u) => ({
          value: u.id,
          label: `${u.profile?.firstName ?? ""} ${u.profile?.lastName ?? ""}`.trim() || u.email,
        }));
    })(),
    toOptions("subject"),
    toOptions("time-slot"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/academic/batch" className="text-body-sm text-muted-foreground hover:text-foreground">
          ← Back to batches
        </Link>
        <h1 className="mt-1 text-h3 font-semibold text-foreground">{batch.name}</h1>
        <p className="text-body text-muted-foreground">Code {batch.code}</p>
      </div>

      <BatchDetailClient
        batch={batch}
        options={{ teachers, subjects, timeSlots }}
        canManage={canManage}
      />
    </div>
  );
}
