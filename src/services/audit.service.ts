import { auditLogRepository, type AuditAction, type AuditEntry } from "@/repositories/audit-log.repository";
import { userRepository } from "@/repositories/user.repository";
import { createClient } from "@/lib/supabase/server";

/**
 * Resolves the current local user id from the Supabase session.
 * Returns null when no session exists.
 */
async function resolveActorId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    const local = await userRepository.getByAuthId(user.id);
    return local?.id ?? null;
  } catch {
    return null;
  }
}

export const auditService = {
  async record(action: AuditAction, extra: Omit<AuditEntry, "action"> = {}): Promise<void> {
    const actorId = extra.actorId ?? (await resolveActorId());
    await auditLogRepository.record({ action, ...extra, actorId });
  },
};
