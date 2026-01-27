import { z } from "zod";

import {
  ThresholdRequestMetric,
  ThresholdRequestOperator,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  NOTIFICATION_FORM_CONSTRAINTS,
  NOTIFICATION_FORM_ERROR_MESSAGES,
} from "@/domain/monitoring-notification/constants/notification-form-error-message";

const metricFieldSchema = z
  .string()
  .min(1, { message: "항목을 선택해 주세요." })
  .pipe(z.nativeEnum(ThresholdRequestMetric));

const operatorFieldSchema = z
  .string()
  .min(1, { message: "연산자를 선택해 주세요." })
  .pipe(z.nativeEnum(ThresholdRequestOperator));

// ===== 임계 조건 스키마 =====

export const thresholdFormSchema = z.object({
  metric: metricFieldSchema,
  operator: operatorFieldSchema,
  value: z.string(),
  durationMinutes: z.string(),
});

export type ThresholdFormType = z.input<typeof thresholdFormSchema>;

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
    hasSystemNotificationEnabled: z.boolean(),
    hasEmailNotificationEnabled: z.boolean(),
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
      data.hasEmailNotificationEnabled || data.hasSystemNotificationEnabled,
    {
      message: NOTIFICATION_FORM_ERROR_MESSAGES.channel.required,
      path: ["hasEmailNotificationEnabled"],
    },
  );

export type NotificationFormType = z.input<typeof notificationFormSchema>;
