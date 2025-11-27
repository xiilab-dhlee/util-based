import type { GetMonitoringNotificationsPayload } from "@/domain/monitoring-notification/types/monitoring-notification.type";

export const monitoringKeys = {
  default: ["monitoring-notification"],
  // Query keys
  notificationSettingList: (payload: GetMonitoringNotificationsPayload) => [
    ...monitoringKeys.default,
    "notificationSettingList",
    ...Object.values(payload),
  ],
  notificationSettingDetail: (id: string) => [
    ...monitoringKeys.default,
    "notificationSettingDetail",
    id,
  ],
  notificationList: (payload: GetMonitoringNotificationsPayload) => [
    ...monitoringKeys.default,
    "notificationList",
    ...Object.values(payload),
  ],
  // Mutation keys
  create: () => [...monitoringKeys.default, "create"],
  update: () => [...monitoringKeys.default, "update"],
  upsert: () => [...monitoringKeys.default, "upsert"],
};
