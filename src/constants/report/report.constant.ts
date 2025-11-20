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
