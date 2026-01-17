import type { DropdownOption } from "xiilab-ui";

export const VOLUME_PAGE_SIZE = 15;
export const VOLUME_CARD_HEIGHT = 112;

export const VOLUME_STORAGE_OPTIONS: DropdownOption[] = [
  {
    label: "AstraGo Storage",
    value: "ASTRAGO",
  },
  {
    label: "On-premise Storage",
    value: "LOCAL",
  },
];

export const VOLUME_VISIBILITY_OPTIONS: DropdownOption[] = [
  {
    label: "공개",
    value: "true",
  },
  {
    label: "비공개",
    value: "false",
  },
];
