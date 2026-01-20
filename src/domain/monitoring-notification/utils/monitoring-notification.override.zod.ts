import { z } from "zod";

import {
  NOTIFICATION_FORM_CONSTRAINTS,
  NOTIFICATION_FORM_ERROR_MESSAGES,
} from "@/domain/monitoring-notification/constants/notification-form-error-message";

// ===== 임계 조건 스키마 =====

export const thresholdFormSchema = z.object({
  metric: z.string(),
  operator: z.string(),
  value: z.string(),
  durationMinutes: z.string(),
});

export type ThresholdFormType = z.infer<typeof thresholdFormSchema>;

// ===== 알림 폼 스키마 =====

export const notificationFormSchema = z
  .object({
    notificationSetName: z
      .string()
      .min(
        NOTIFICATION_FORM_CONSTRAINTS.notificationSetName.MIN_LENGTH,
        NOTIFICATION_FORM_ERROR_MESSAGES.notificationSetName.too_small,
      )
      .max(
        NOTIFICATION_FORM_CONSTRAINTS.notificationSetName.MAX_LENGTH,
        NOTIFICATION_FORM_ERROR_MESSAGES.notificationSetName.too_big,
      ),
    isSystemNotificationEnabled: z.boolean(),
    isEmailNotificationEnabled: z.boolean(),
    nodeName: z
      .array(z.string())
      .min(
        NOTIFICATION_FORM_CONSTRAINTS.nodeName.MIN_COUNT,
        NOTIFICATION_FORM_ERROR_MESSAGES.nodeName.too_small,
      ),
    threshold: z
      .array(thresholdFormSchema)
      .min(
        NOTIFICATION_FORM_CONSTRAINTS.threshold.MIN_COUNT,
        NOTIFICATION_FORM_ERROR_MESSAGES.threshold.too_small,
      ),
  })
  .refine(
    (data) =>
      data.isEmailNotificationEnabled || data.isSystemNotificationEnabled,
    {
      message: NOTIFICATION_FORM_ERROR_MESSAGES.channel.required,
      path: ["isEmailNotificationEnabled"],
    },
  );

export type NotificationFormType = z.infer<typeof notificationFormSchema>;
