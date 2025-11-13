import type {
  GetMonitoringNotificationSettingsPayload,
  GetMonitoringNotificationsPayload,
} from "@/types/monitoring-notification/monitoring-notification.type";

const monitoringKeys = {
  default: ["monitoring"],
  notificationSettingList: (
    payload: GetMonitoringNotificationSettingsPayload,
  ) => [
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
};

export default monitoringKeys;
