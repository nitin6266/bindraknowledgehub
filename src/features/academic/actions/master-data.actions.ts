"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { masterDataRepository } from "@/repositories/master-data.repository";
import {
  getModuleConfig,
  buildZodSchema,
  serializeForPrisma,
} from "@/features/academic/master-data/config";
import {
  isMasterModule,
  type MasterModuleKey,
} from "@/features/academic/master-data/constants";
import type { MasterFormValues } from "@/features/academic/master-data/types";

export type ActionResult = { success: true } | { success: false; error: string };

const MANAGE_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

function pathFor(module: MasterModuleKey): string {
  return `/dashboard/academic/${module}`;
}

export async function createMasterAction(
  module: string,
  values: MasterFormValues,
): Promise<ActionResult> {
  if (!isMasterModule(module)) {
    return { success: false, error: "Unknown module." };
  }
  const config = getModuleConfig(module);
  if (!config) {
    return { success: false, error: "Unknown module." };
  }

  const parsed = buildZodSchema(config).safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  const actor = await authorizeAction(MANAGE_ROLES);
  if (!actor) {
    return { success: false, error: "You are not authorized to manage academic data." };
  }

  try {
    if (module === "academic-session" && parsed.data.status === "ACTIVE") {
      await masterDataRepository.archiveOtherActiveSessions("");
    }
    const data = serializeForPrisma(config, parsed.data);
    await masterDataRepository.create(module, data);
    revalidatePath(pathFor(module));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not create record." };
  }
}

export async function updateMasterAction(
  module: string,
  id: string,
  values: MasterFormValues,
): Promise<ActionResult> {
  if (!isMasterModule(module)) {
    return { success: false, error: "Unknown module." };
  }
  const config = getModuleConfig(module);
  if (!config) {
    return { success: false, error: "Unknown module." };
  }

  const parsed = buildZodSchema(config).safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  const actor = await authorizeAction(MANAGE_ROLES);
  if (!actor) {
    return { success: false, error: "You are not authorized to manage academic data." };
  }

  try {
    if (module === "academic-session" && parsed.data.status === "ACTIVE") {
      await masterDataRepository.archiveOtherActiveSessions(id);
    }
    const data = serializeForPrisma(config, parsed.data);
    await masterDataRepository.update(module, id, data);
    revalidatePath(pathFor(module));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not update record." };
  }
}

export async function deleteMasterAction(module: string, id: string): Promise<ActionResult> {
  if (!isMasterModule(module)) {
    return { success: false, error: "Unknown module." };
  }

  const actor = await authorizeAction(MANAGE_ROLES);
  if (!actor) {
    return { success: false, error: "You are not authorized to manage academic data." };
  }

  try {
    await masterDataRepository.softDelete(module, id);
    revalidatePath(pathFor(module as MasterModuleKey));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not delete record." };
  }
}
