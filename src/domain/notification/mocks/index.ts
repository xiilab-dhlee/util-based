import type { HttpHandler } from "msw";

import { getAccountNotificationMock } from "@/api/generated/account-notification/account-notification.msw";
import { getAdminAccountNotificationMock } from "@/api/generated/admin-account-notification/admin-account-notification.msw";
import { notificationInfiniteOverrideHandlers } from "@/domain/notification/mocks/notification-infinite.override";

export const notificationHandlers: HttpHandler[] = [
  // Override handlers (우선순위 높음)
  ...notificationInfiniteOverrideHandlers,
  // Generated handlers
  ...getAccountNotificationMock(),
  ...getAdminAccountNotificationMock(),
];
