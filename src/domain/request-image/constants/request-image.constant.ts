import type { DropdownOption } from "xiilab-ui";

export const REQUEST_IMAGE_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "대기중",
    value: "PENDING",
  },
  {
    label: "승인됨",
    value: "APPROVED",
  },
  {
    label: "거절됨",
    value: "REJECTED",
  },
  {
    label: "완료",
    value: "COMPLETED",
  },
];
