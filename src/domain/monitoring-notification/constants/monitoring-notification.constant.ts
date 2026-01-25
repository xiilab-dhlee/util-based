import type { DropdownOption } from "xiilab-ui";

import type {
  GetAllMonitoringNotificationHistoriesSort,
  GetAllMonitoringNotificationSetsSort,
  MonitoringNotificationHistoryDetailResponseThresholdOperator,
  SentRecipientResponseSendStatus,
  ThresholdRequestMetric,
  ThresholdRequestOperator,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { ThresholdFormType } from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";
import type { AntdTableSortState } from "@/shared/types/core.model";

export const MONITORING_NOTIFICATION_PAGE_SIZE = 10;

/**
 * 모니터링 알림 히스토리 정렬 필드 매핑 (Frontend → Backend)
 */
export const MONITORING_NOTIFICATION_HISTORY_SORT_FIELD_MAP = {
  nodeName: "NODE_NAME",
  nodeIp: "NODE_IP",
  notificationSetName: "NOTIFICATION_SET_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetAllMonitoringNotificationHistoriesSort>;

/** 모니터링 알림 히스토리 정렬 필드 타입 */
export type MonitoringNotificationHistorySortField =
  keyof typeof MONITORING_NOTIFICATION_HISTORY_SORT_FIELD_MAP;

export const MONITORING_NOTIFICATION_HISTORY_SORT_FIELDS = Object.keys(
  MONITORING_NOTIFICATION_HISTORY_SORT_FIELD_MAP,
) as MonitoringNotificationHistorySortField[];

/** 모니터링 알림 히스토리 정렬 상태 타입 (non-nullable) */
export type MonitoringNotificationHistorySortState = {
  field: NonNullable<
    AntdTableSortState<MonitoringNotificationHistorySortField>["field"]
  >;
  order: NonNullable<
    AntdTableSortState<MonitoringNotificationHistorySortField>["order"]
  >;
};

/** 모니터링 알림 히스토리 기본 정렬 상태 */
export const MONITORING_NOTIFICATION_HISTORY_DEFAULT_SORT: MonitoringNotificationHistorySortState =
  {
    field: "createdAt",
    order: "descend",
  };

/**
 * 모니터링 알림 설정 정렬 필드 매핑 (Frontend → Backend)
 */
export const MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP = {
  notificationSetName: "NOTIFICATION_SET_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetAllMonitoringNotificationSetsSort>;

/** 모니터링 알림 설정 정렬 필드 타입 */
export type MonitoringNotificationSettingSortField =
  keyof typeof MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP;

export const MONITORING_NOTIFICATION_SETTING_SORT_FIELDS = Object.keys(
  MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP,
) as MonitoringNotificationSettingSortField[];

/** 모니터링 알림 설정 정렬 상태 타입 (non-nullable) */
export type MonitoringNotificationSettingSortState = {
  field: NonNullable<
    AntdTableSortState<MonitoringNotificationSettingSortField>["field"]
  >;
  order: NonNullable<
    AntdTableSortState<MonitoringNotificationSettingSortField>["order"]
  >;
};

/** 모니터링 알림 설정 기본 정렬 상태 */
export const MONITORING_NOTIFICATION_SETTING_DEFAULT_SORT: MonitoringNotificationSettingSortState =
  {
    field: "createdAt",
    order: "descend",
  };

/**
 * 메트릭 타입 코드 → 라벨 매핑 (API enum 값 사용)
 */
export const METRIC_TYPE_LABEL_MAP: Record<ThresholdRequestMetric, string> = {
  GPU_USAGE: "GPU 사용률",
  GPU_MEMORY: "GPU Memory 사용률",
  CPU_USAGE: "CPU 사용률",
  MEMORY_USAGE: "Memory 사용률",
  GPU_TEMP: "GPU 온도",
};

/** 유효한 메트릭 타입 배열 (타입 가드용) */
export const VALID_METRICS = Object.keys(
  METRIC_TYPE_LABEL_MAP,
) as ThresholdRequestMetric[];

/**
 * 유효한 연산자 배열 (타입 가드용) - API enum 값 사용
 */
export const VALID_OPERATORS: ThresholdRequestOperator[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];
export type ValidOperator = ThresholdRequestOperator;

/** 메트릭 타입 드롭다운 옵션 (GPU_TEMP 제외) */
export const METRIC_TYPE_OPTIONS: DropdownOption[] = [
  { value: "GPU_USAGE", label: METRIC_TYPE_LABEL_MAP.GPU_USAGE },
  { value: "GPU_MEMORY", label: METRIC_TYPE_LABEL_MAP.GPU_MEMORY },
  { value: "CPU_USAGE", label: METRIC_TYPE_LABEL_MAP.CPU_USAGE },
  { value: "MEMORY_USAGE", label: METRIC_TYPE_LABEL_MAP.MEMORY_USAGE },
];

/** 연산자 → 기호 매핑 (UI 표시용) */
export const OPERATOR_SYMBOL_MAP: Record<ThresholdRequestOperator, string> = {
  GREATER_THAN: ">",
  LESS_THAN: "<",
  GREATER_THAN_OR_EQUAL: ">=",
  LESS_THAN_OR_EQUAL: "<=",
};

/** 연산자 드롭다운 옵션 (value: enum, label: 기호) */
export const OPERATOR_OPTIONS: DropdownOption[] = VALID_OPERATORS.map(
  (operator) => ({
    value: operator,
    label: OPERATOR_SYMBOL_MAP[operator],
  }),
);

/**
 * 임계값/지속시간 표시 단위
 */
export const THRESHOLD_UNIT = "%";
export const DURATION_UNIT = "분";

/**
 * 알림 설정 Form용 초기값
 */
export const EMPTY_THRESHOLD_SETTING: ThresholdFormType = {
  metric: "",
  operator: "",
  value: "",
  durationMinutes: "",
};

/**
 * 알림 채널 라벨 상수
 */
export const NOTIFICATION_CHANNEL_LABEL = {
  EMAIL: "E-mail",
  SYSTEM: "System",
} as const;

/**
 * 모니터링 알림 폼 필드 ID
 */
export const MONITORING_NOTIFICATION_FIELD_IDS = {
  notificationSetName: "monitoring-notification-set-name",
  nodeName: "monitoring-notification-node-name",
} as const;

/**
 * 임계 연산자 → 기호 변환 매핑 (응답 타입용, UI 표시에 사용)
 */
export const THRESHOLD_OPERATOR_SYMBOL_MAP: Record<
  MonitoringNotificationHistoryDetailResponseThresholdOperator,
  string
> = OPERATOR_SYMBOL_MAP;

/**
 * 발송 상태 라벨 매핑
 */
export const SEND_STATUS_LABEL_MAP: Record<
  SentRecipientResponseSendStatus,
  string
> = {
  SENT: "성공",
  FAILED: "실패",
};
