import type { DropdownOption } from "xiilab-ui";

import type { MonitoringNotificationSettingFormType } from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";

export const MONITORING_NOTIFICATION_PAGE_SIZE = 10;

/**
 * 모니터링 알림 항목 코드 → 라벨 매핑 (단일 소스)
 */
export const MONITORING_NOTIFICATION_TYPE_LABEL_MAP = {
  GPU: "GPU 사용률",
  GPU_MEMORY: "GPU 메모리 사용률",
  CPU: "CPU 사용률",
  MEM: "Memory 사용률",
} as const;

/**
 * 모니터링 알림 연산자 코드 → 라벨 매핑 (단일 소스)
 */
export const MONITORING_NOTIFICATION_OPERATOR_LABEL_MAP = {
  greaterThan: ">",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<=",
  lessThan: "<",
} as const;

/**
 * 드롭다운 옵션은 LABEL_MAP에서 파생
 */
export const MONITORING_NOTIFICATION_TYPE_OPTIONS: DropdownOption[] =
  Object.entries(MONITORING_NOTIFICATION_TYPE_LABEL_MAP).map(
    ([value, label]) => ({
      value,
      label,
    }),
  );

export const MONITORING_NOTIFICATION_OPERATOR_OPTIONS: DropdownOption[] =
  Object.entries(MONITORING_NOTIFICATION_OPERATOR_LABEL_MAP).map(
    ([value, label]) => ({
      value,
      label,
    }),
  );

/**
 * 임계값/지속시간 표시 단위
 */
export const MONITORING_NOTIFICATION_THRESHOLD_UNIT = "%";
export const MONITORING_NOTIFICATION_DURATION_UNIT = "분";

/**
 * 알림 설정 Form용 초기값
 */
export const EMPTY_NOTIFICATION_SETTING: MonitoringNotificationSettingFormType =
  {
    item: "",
    operator: "",
    threshold: "",
    duration: "",
  };
