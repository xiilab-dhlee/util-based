import type { DropdownOption, TagProps } from "xiilab-ui";

/** 크리덴셜 타입 값 */
export const CREDENTIAL_TYPES = {
  GIT_REPOSITORY: "GIT_REPOSITORY",
  IMAGE_REGISTRY: "IMAGE_REGISTRY",
} as const;

export type CredentialType =
  (typeof CREDENTIAL_TYPES)[keyof typeof CREDENTIAL_TYPES];

/** 크리덴셜 타입별 라벨 */
export const CREDENTIAL_TYPE_LABEL: Record<CredentialType, string> = {
  [CREDENTIAL_TYPES.GIT_REPOSITORY]: "Git Repository",
  [CREDENTIAL_TYPES.IMAGE_REGISTRY]: "Image Registry",
} as const;

/** 크리덴셜 타입별 Tag variant */
export const CREDENTIAL_TYPE_TAG_VARIANT: Record<
  CredentialType,
  TagProps["variant"]
> = {
  [CREDENTIAL_TYPES.GIT_REPOSITORY]: "yellow",
  [CREDENTIAL_TYPES.IMAGE_REGISTRY]: "purple",
} as const;

/**
 * 크리덴셜 타입 정보 조회
 * @param credentialType - 크리덴셜 타입
 * @returns 라벨과 Tag variant 정보
 */
export function getCredentialTypeInfo(credentialType?: string): {
  label: string;
  variant: TagProps["variant"];
} {
  const type = credentialType as CredentialType;
  return {
    label: CREDENTIAL_TYPE_LABEL[type] ?? "-",
    variant: CREDENTIAL_TYPE_TAG_VARIANT[type],
  };
}

/**
 * 크리덴셜 타입 옵션 (IMAGE, SOURCE_CODE)
 */
export const CREDENTIAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: CREDENTIAL_TYPE_LABEL[CREDENTIAL_TYPES.GIT_REPOSITORY],
    value: CREDENTIAL_TYPES.GIT_REPOSITORY,
  },
  {
    label: CREDENTIAL_TYPE_LABEL[CREDENTIAL_TYPES.IMAGE_REGISTRY],
    value: CREDENTIAL_TYPES.IMAGE_REGISTRY,
  },
];
