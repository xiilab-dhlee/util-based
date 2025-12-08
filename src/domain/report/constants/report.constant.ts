import type { DropdownOption } from "xiilab-ui";

export const REPORT_DATE_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "주간",
    value: "WEEKLY",
  },
  {
    label: "월간",
    value: "MONTHLY",
  },
];

export const REPORT_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "시스템 리포트",
    value: "SYSTEM",
  },
  {
    label: "클러스터 리포트",
    value: "CLUSTER",
  },
];

/**
 * 리포트 날짜 타입 텍스트
 */
export const REPORT_DATE_TYPE_TEXT = {
  WEEKLY: "주간",
  MONTHLY: "월간",
} as const;

/**
 * 리포트 타입 텍스트
 */
export const REPORT_TYPE_TEXT = {
  SYSTEM: "시스템",
  CLUSTER: "클러스터 자원 정보",
} as const;

/**
 * 평균 사용률 텍스트
 */
export const AVERAGE_USAGE_TEXT = {
  WEEKLY: "주간 평균 사용률",
  MONTHLY: "월 평균 사용률",
} as const;
