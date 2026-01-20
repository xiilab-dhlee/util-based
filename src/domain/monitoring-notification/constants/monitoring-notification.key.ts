export const monitoringKeys = {
  default: ["monitoring-notification"],
  // Query keys
  notificationSettingDetail: (id: string) => [
    ...monitoringKeys.default,
    "notificationSettingDetail",
    id,
  ],
  // Mutation keys
  create: () => [...monitoringKeys.default, "create"],
  update: () => [...monitoringKeys.default, "update"],
};
