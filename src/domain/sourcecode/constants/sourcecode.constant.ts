import type { DropdownOption } from "xiilab-ui";

export const SOURCECODE_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "공개",
    value: "PUBLIC",
  },
  {
    label: "비공개",
    value: "PRIVATE",
  },
];

export const SOURCECODE_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "GitHub",
    value: "GITHUB",
  },
  {
    label: "GitLab",
    value: "GITLAB",
  },
  {
    label: "Bitbucket",
    value: "BITBUCKET",
  },
];
