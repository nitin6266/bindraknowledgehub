import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/database/prisma";
import { roleRepository } from "@/repositories/role.repository";
import { userRepository } from "@/repositories/user.repository";
import { ROLES } from "@/constants/roles";

interface ParentInput {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address?: string;
}

function generateTempPassword(): string {
  return `Parent@${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Creates a new Parent auth+ERP account, or returns the existing parent when
 * the email is already registered. Returns the ERP user id.
 */
export async function createOrLinkParent(input: ParentInput): Promise<{ id: string; created: boolean }> {
  const existing = await userRepository.getByEmail(input.email);
  if (existing) {
    return { id: existing.id, created: false };
  }

  const supabase = createAdminClient();
  const tempPassword = generateTempPassword();

  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.mobile,
      force_password_change: true,
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to create parent auth account.");
  }

  const parentRole = await roleRepository.getByName(ROLES.PARENT);
  if (!parentRole) {
    throw new Error("PARENT role is missing. Run the seed script.");
  }

  const user = await prisma.user.create({
    data: {
      authId: data.user.id,
      email: input.email,
      roleId: parentRole.id,
      status: "ACTIVE",
      profile: {
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.mobile,
          gender: null,
          photoUrl: null,
        },
      },
    },
  });

  return { id: user.id, created: true };
}
