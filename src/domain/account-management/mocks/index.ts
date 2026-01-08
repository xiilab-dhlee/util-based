import type { HttpHandler } from "msw";

import { getAdminAccountMock } from "@/api/generated/admin-account/admin-account.msw";
import { adminAccountDetailOverrideHandlers } from "@/domain/account-management/mocks/admin-account-detail.override";
import { adminAccountListOverrideHandlers } from "./admin-account-list.override";
import { adminAccountPendingListOverrideHandlers } from "./admin-account-pending-list.override";

export const accountManagementHandlers: HttpHandler[] = [
  ...adminAccountListOverrideHandlers,
  ...adminAccountPendingListOverrideHandlers,
  ...adminAccountDetailOverrideHandlers,
  ...getAdminAccountMock(),
];
