export type SecurityLevelKey = "critical" | "high" | "medium" | "low";

export type SecurityUsageStatus = "enabled" | "disabled";

export const SECURITY_USAGE_ENABLED: SecurityUsageStatus = "enabled";
export const SECURITY_USAGE_DISABLED: SecurityUsageStatus = "disabled";

export const SECURITY_LEVEL_THRESHOLD_MIN = 1;
// 보안 레벨 기준 설정 시 사용되는 취약점 개수 기준값 상한.
// - 단위: 개 (vulnerability count)
// - 이유: UI에서 비현실적으로 큰 값 입력을 방지하면서, 일반적인 운영 시나리오를 충분히 커버하기 위한 4자리 정수 한도.
// - 참고: 현재는 제품 정책/백엔드 스키마에 의해 고정된 값이 아니라 프론트엔드 입력 한도로만 사용되므로,
//         정책 또는 스펙(예: 보안 레벨 기준 설정 기획서, 백엔드 검증 로직)에서 상한이 정의되면 그 값에 맞춰 조정하거나 설정/환경변수로 이관해야 함.
export const SECURITY_LEVEL_THRESHOLD_MAX = 9999;
export const DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT =
  SECURITY_LEVEL_THRESHOLD_MIN;

interface SecurityUsageOption {
  key: SecurityUsageStatus;
  label: string;
}

export const SECURITY_USAGE_OPTIONS: SecurityUsageOption[] = [
  { key: SECURITY_USAGE_ENABLED, label: "사용" },
  { key: SECURITY_USAGE_DISABLED, label: "미사용" },
];

export type SecuritySchedulePeriodUnit = "day" | "week" | "month";

export const SECURITY_SCHEDULE_PERIOD_UNIT_DAY: SecuritySchedulePeriodUnit =
  "day";
export const SECURITY_SCHEDULE_PERIOD_UNIT_WEEK: SecuritySchedulePeriodUnit =
  "week";
export const SECURITY_SCHEDULE_PERIOD_UNIT_MONTH: SecuritySchedulePeriodUnit =
  "month";

interface SecuritySchedulePeriodUnitOption {
  key: SecuritySchedulePeriodUnit;
  label: string;
}

export const SECURITY_SCHEDULE_PERIOD_UNITS: SecuritySchedulePeriodUnitOption[] =
  [
    { key: SECURITY_SCHEDULE_PERIOD_UNIT_DAY, label: "일" },
    { key: SECURITY_SCHEDULE_PERIOD_UNIT_WEEK, label: "주" },
    { key: SECURITY_SCHEDULE_PERIOD_UNIT_MONTH, label: "개월" },
  ];

// 공통 요일 상수 re-export (기존 코드 호환)
export {
  WEEK_DAYS as SECURITY_WEEK_DAYS,
  type WeekDayKey as SecurityWeekDayKey,
} from "./date.constant";
