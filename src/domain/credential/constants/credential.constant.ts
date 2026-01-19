import type { DropdownOption } from "xiilab-ui";

/**
 * 크리덴셜 채널 옵션 (GIT, DOCKER, NGC)
 */
export const CREDENTIAL_CHANNEL_OPTIONS: DropdownOption[] = [
  {
    label: "Github",
    value: "GIT",
  },
  {
    label: "Gitlab",
    value: "GITLAB",
  },
  {
    label: "Bitbucket",
    value: "BITBUCKET",
  },
  {
    label: "Docker",
    value: "DOCKER",
  },
  {
    label: "Ngc",
    value: "NGC",
  },
];

/**
 * 크리덴셜 타입 옵션 (IMAGE, SOURCE_CODE)
 */
export const CREDENTIAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "Source Code",
    value: "SOURCE_CODE",
  },
  {
    label: "Image",
    value: "IMAGE",
  },
];
