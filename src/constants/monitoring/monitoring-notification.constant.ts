import type { DropdownOption } from "xiilab-ui";

export const MONITORING_NOTIFICATION_PAGE_SIZE = 10;

export const MONITORING_NOTIFICATION_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "GPU",
    value: "GPU",
  },
  {
    label: "GPU 메모리",
    value: "GPU_MEMORY",
  },
  {
    label: "CPU",
    value: "CPU",
  },
  {
    label: "MEM",
    value: "MEM",
  },
];

export const MONITORING_NOTIFICATION_OPERATOR_OPTIONS: DropdownOption[] = [
  {
    label: ">",
    value: ">",
  },
  {
    label: ">=",
    value: ">=",
  },
  {
    label: "<=",
    value: "<=",
  },
  {
    label: "<",
    value: "<",
  },
];
