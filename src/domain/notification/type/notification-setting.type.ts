export const NOTIFICATION_CHANNEL = {
  SYSTEM: "SYSTEM",
  EMAIL: "EMAIL",
} as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNEL)[keyof typeof NOTIFICATION_CHANNEL];

export type NotificationChannelState = {
  systemChecked: boolean;
  emailChecked: boolean;
};

export type NotificationConfirmState = {
  channel: NotificationChannel;
  value: boolean;
} | null;
