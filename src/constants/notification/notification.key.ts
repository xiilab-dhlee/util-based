import type { GetNotificationsPayload } from "@/types/notification/notification.type";

export const notificationKeys = {
  default: ["notification"],
  list: (payload: GetNotificationsPayload) => [
    ...notificationKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (id: string) => [...notificationKeys.default, "detail", id],
};
