import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_ROLES } from "@/shared/constants/core.constant";

export interface AccountActionAuthContext {
  currentAccountId: string | null;
  isCurrentAdmin: boolean;
  isCurrentSuperAdmin: boolean;
}

export const DEFAULT_ACCOUNT_ACTION_AUTH_CONTEXT: AccountActionAuthContext = {
  currentAccountId: null,
  isCurrentAdmin: false,
  isCurrentSuperAdmin: false,
};

export const getAccountActionState = (
  account: AccountItemResponse,
  authContext: AccountActionAuthContext,
) => {
  const isSelf =
    authContext.currentAccountId !== null &&
    account.accountId === authContext.currentAccountId;
  const isTargetSuperAdmin = account.accountRole === ACCOUNT_ROLES.SUPER_ADMIN;
  const isSelfRestricted =
    isSelf && (authContext.isCurrentAdmin || authContext.isCurrentSuperAdmin);
  const isAdminTargetSuperAdminRestricted =
    authContext.isCurrentAdmin && isTargetSuperAdmin;

  return {
    isStatusDisabled: isSelfRestricted || isAdminTargetSuperAdminRestricted,
    isUpdateDisabled: isAdminTargetSuperAdminRestricted,
    isResetPasswordDisabled: isAdminTargetSuperAdminRestricted,
    isDeleteDisabled: isSelfRestricted || isAdminTargetSuperAdminRestricted,
  };
};
