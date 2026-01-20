import type {
  MonitoringNotificationHistoryDetailResponseMetricType,
  MonitoringNotificationHistoryDetailResponseThresholdOperator,
  MonitoringNotificationSendHistoryResponseNotificationChannel,
  SentRecipientResponseSendStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  METRIC_TYPE_LABEL_MAP,
  NOTIFICATION_CHANNEL_LABEL,
  SEND_STATUS_LABEL_MAP,
  THRESHOLD_OPERATOR_SYMBOL_MAP,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";

/**
 * 알림 채널 유형 문자열 생성 (복수 채널)
 */
export const getChannelLabel = (
  isSystem: boolean,
  isEmail: boolean,
): string => {
  const channels: string[] = [];
  if (isEmail) channels.push(NOTIFICATION_CHANNEL_LABEL.EMAIL);
  if (isSystem) channels.push(NOTIFICATION_CHANNEL_LABEL.SYSTEM);
  return channels.length > 0 ? channels.join(", ") : "-";
};

/**
 * 메트릭 타입 라벨 반환
 */
export const getMetricTypeLabel = (
  type: MonitoringNotificationHistoryDetailResponseMetricType,
): string => {
  return METRIC_TYPE_LABEL_MAP[type] ?? type;
};

/**
 * 임계 연산자 → 기호 변환
 */
export const getThresholdOperatorSymbol = (
  operator: MonitoringNotificationHistoryDetailResponseThresholdOperator,
): string => {
  return THRESHOLD_OPERATOR_SYMBOL_MAP[operator] ?? operator;
};

/**
 * 알림 채널 라벨 반환 (단일 채널)
 */
export const getNotificationChannelLabel = (
  channel: MonitoringNotificationSendHistoryResponseNotificationChannel,
): string => {
  return NOTIFICATION_CHANNEL_LABEL[channel] ?? channel;
};

/**
 * 발송 상태 라벨 반환
 */
export const getSendStatusLabel = (
  status: SentRecipientResponseSendStatus,
): string => {
  return SEND_STATUS_LABEL_MAP[status] ?? status;
};
