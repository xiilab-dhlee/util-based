import type { DropdownOption } from "xiilab-ui";

export const ADMIN_INTERNAL_REGISTRY_IMAGE_TAG_PAGE_SIZE = 10;

export const INTERNAL_REGISTRY_IMAGE_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "공개",
    value: "PUBLIC",
  },
  {
    label: "비공개",
    value: "PRIVATE",
  },
];
