import type {
  MonitoringNotificationSetCreateRequest,
  MonitoringNotificationSetDetailResponse,
  ThresholdRequestMetric,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  toFormOperator,
  VALID_METRICS,
  VALID_OPERATORS,
  type ValidOperator,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import type { NotificationFormType } from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";

// ===== 타입 가드 =====

export function isValidMetric(value: string): value is ThresholdRequestMetric {
  return VALID_METRICS.some((metric) => metric === value);
}

export function isValidOperator(value: string): value is ValidOperator {
  return VALID_OPERATORS.some((operator) => operator === value);
}

type ValidThresholdFormType = {
  metric: ThresholdRequestMetric;
  operator: ValidOperator;
  value: string;
  durationMinutes: string;
};

function isFiniteNumericString(value: string): boolean {
  return value !== "" && Number.isFinite(Number(value));
}

function isValidThresholdFormType(
  threshold: NotificationFormType["threshold"][number],
): threshold is NotificationFormType["threshold"][number] &
  ValidThresholdFormType {
  return (
    isValidMetric(threshold.metric) &&
    isValidOperator(threshold.operator) &&
    isFiniteNumericString(threshold.value) &&
    isFiniteNumericString(threshold.durationMinutes)
  );
}

// ===== 변환 함수 =====

/**
 * 폼 데이터 → API 요청 변환
 */
export function toCreateRequest(
  formData: NotificationFormType,
): MonitoringNotificationSetCreateRequest {
  const validThresholds = formData.threshold.filter(isValidThresholdFormType);

  return {
    notificationSetName: formData.notificationSetName,
    isEmailNotificationEnabled: formData.isEmailNotificationEnabled,
    isSystemNotificationEnabled: formData.isSystemNotificationEnabled,
    nodeName: formData.nodeName,
    threshold: validThresholds.map((t) => ({
      metric: t.metric,
      operator: t.operator,
      value: Number(t.value),
      durationMinutes: Number(t.durationMinutes),
    })),
  };
}

/**
 * API 상세 조회 응답 → 폼 데이터 변환
 */
export function toFormData(
  response: MonitoringNotificationSetDetailResponse,
): NotificationFormType {
  return {
    notificationSetName: response.notificationSetName,
    nodeName: response.node,
    isEmailNotificationEnabled: response.isEmailNotificationEnabled,
    isSystemNotificationEnabled: response.isSystemNotificationEnabled,
    threshold: response.threshold.map((t) => ({
      metric: t.metric,
      operator: toFormOperator(t.operator),
      value: String(t.value),
      durationMinutes: String(t.durationMinutes),
    })),
  };
}
