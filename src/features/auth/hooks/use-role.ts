"use client";

import { useMemo } from "react";

import { useAuth } from "@/providers/auth-provider";
import { ROLES, type Role } from "@/constants/roles";

export function useRole(): { role: Role | null; isLoading: boolean } {
  const { user, isLoading } = useAuth();

  const role = useMemo<Role | null>(() => {
    if (!user) {
      return null;
    }
    const value = user.app_metadata?.["role"] as Role | undefined;
    return value && Object.values(ROLES).includes(value) ? value : null;
  }, [user]);

  return { role, isLoading };
}
