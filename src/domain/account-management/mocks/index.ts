import type { HttpHandler } from "msw";

import { getAccountMock } from "@/api/generated/account/account.msw";
import { getAdminAccountMock } from "@/api/generated/admin-account/admin-account.msw";
import { adminAccountDetailOverrideHandlers } from "@/domain/account-management/mocks/admin-account-detail.override";

export const accountManagementHandlers: HttpHandler[] = [
  ...adminAccountDetailOverrideHandlers,
  ...getAccountMock(),
  ...getAdminAccountMock(),
];
