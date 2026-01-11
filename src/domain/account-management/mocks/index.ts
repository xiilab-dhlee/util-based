import type { HttpHandler } from "msw";

import { getAccountMock } from "@/api/generated/account/account.msw";
import { getAdminAccountMock } from "@/api/generated/admin-account/admin-account.msw";
import { adminAccountDetailOverrideHandlers } from "@/domain/account-management/mocks/admin-account-detail.override";
import { adminAccountListOverrideHandlers } from "@/domain/account-management/mocks/admin-account-list.override";
import { adminAccountPendingListOverrideHandlers } from "@/domain/account-management/mocks/admin-account-pending-list.override";

export const accountManagementHandlers: HttpHandler[] = [
  ...adminAccountListOverrideHandlers,
  ...adminAccountPendingListOverrideHandlers,
  ...adminAccountDetailOverrideHandlers,
  ...getAccountMock(),
  ...getAdminAccountMock(),
];
