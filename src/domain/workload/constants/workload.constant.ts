import type { DropdownOption } from "xiilab-ui";

export const WORKLOAD_IMAGE_TYPES = [
  "HUB",
  "BUILTIN",
  "INTERNAL_REGISTRY",
  "EXTERNAL_REGISTRY",
] as const;

export const WORKLOAD_JOB_OPTIONS: DropdownOption[] = [
  {
    label: "Batch",
    value: "BATCH",
  },
  {
    label: "Interactive",
    value: "INTERACTIVE",
  },
  {
    label: "Distributed",
    value: "DISTRIBUTED",
  },
];

export const WORKLOAD_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "실행중",
    value: "RUNNING",
  },
  {
    label: "대기중",
    value: "PENDING",
  },
  {
    label: "에러",
    value: "ERROR",
  },
  {
    label: "종료",
    value: "COMPLETED",
  },
];
