import { notFound } from "next/navigation";

import { assertRole, getCurrentRole } from "@/lib/auth/authorize";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { getModuleConfig, nameKeyFor } from "@/features/academic/master-data/config";
import { ACADEMIC_VIEW_ROLES, canManageAcademic, isMasterModule } from "@/features/academic/master-data/constants";
import { MasterDataClient } from "@/features/academic/components/master-data-client";
import type { FieldConfig, SelectOption } from "@/features/academic/master-data/types";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";

export const dynamic = "force-dynamic";

export default async function AcademicModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;

  if (!isMasterModule(module)) {
    notFound();
  }

  const config = getModuleConfig(module);
  if (!config) {
    notFound();
  }

  await assertRole(ACADEMIC_VIEW_ROLES);
  const role = await getCurrentRole();
  const canManage = canManageAcademic(role);

  const [rows, relationOptions] = await Promise.all([
    masterDataRepository.list(module),
    buildRelationOptions(config.fields),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-semibold text-foreground">{config.title}</h1>
        <p className="text-body text-muted-foreground">{config.description}</p>
      </div>

      <MasterDataClient
        config={config}
        rows={rows}
        relationOptions={relationOptions}
        canManage={canManage}
      />
    </div>
  );
}

async function buildRelationOptions(fields: FieldConfig[]): Promise<Record<string, SelectOption[]>> {
  const map: Record<string, SelectOption[]> = {};

  const relationFields = fields.filter(
    (f): f is FieldConfig & { relation: MasterModuleKey } => f.type === "relation" && !!f.relation,
  );

  await Promise.all(
    relationFields.map(async (f) => {
      const related = await masterDataRepository.list(f.relation);
      const nameKey = nameKeyFor(f.relation);
      map[f.key] = related.map((r) => ({
        value: String(r.id),
        label: String(r[nameKey] ?? ""),
      }));
    }),
  );

  return map;
}
