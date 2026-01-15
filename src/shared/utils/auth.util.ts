import type { Session } from "next-auth";

import { ACCOUNT_ROLES } from "@/shared/constants/core.constant";

export function checkIsSuperAdmin(session: Session | null): boolean {
  if (!session?.roles) return false;

  return session.roles.some((role) => role === ACCOUNT_ROLES.SUPER_ADMIN);
}

export function getSessionAccountId(session: Session | null): string | null {
  return session?.user?.id ?? null;
}
