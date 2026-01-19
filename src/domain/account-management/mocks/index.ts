import type { HttpHandler } from "msw";

import { getAccountRegistrationMock } from "@/api/generated/account-registration/account-registration.msw";
import { getAdminAccountManagementMock } from "@/api/generated/admin-account-management/admin-account-management.msw";
import { adminAccountDetailOverrideHandlers } from "@/domain/account-management/mocks/admin-account-detail.override";
import { adminAccountListOverrideHandlers } from "@/domain/account-management/mocks/admin-account-list.override";
import { adminAccountPendingListOverrideHandlers } from "@/domain/account-management/mocks/admin-account-pending-list.override";

export const accountManagementHandlers: HttpHandler[] = [
  ...adminAccountListOverrideHandlers,
  ...adminAccountPendingListOverrideHandlers,
  ...adminAccountDetailOverrideHandlers,
  ...getAccountRegistrationMock(),
  ...getAdminAccountManagementMock(),
];
