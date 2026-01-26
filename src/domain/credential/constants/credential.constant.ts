import type { DropdownOption, TagProps } from "xiilab-ui";

import { CredentialListItemResponseCredentialType as CREDENTIAL_TYPES } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CreateCredentialFormType } from "../schemas/credential.schema";

/** 크리덴셜 타입 (API 스키마에서 가져온 타입) */
export type CredentialType = CREDENTIAL_TYPES;

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
export function getCredentialTypeInfo(credentialType?: CredentialType): {
  label: string;
  variant: TagProps["variant"];
} {
  if (!credentialType) {
    return { label: "-", variant: undefined };
  }
  return {
    label: CREDENTIAL_TYPE_LABEL[credentialType] ?? "-",
    variant: CREDENTIAL_TYPE_TAG_VARIANT[credentialType],
  };
}

/**
 * 크리덴셜 타입 옵션 (드롭다운용)
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
/** 크리덴셜 생성 폼 기본 값 */
export const CREDENTIAL_DEFAULT_FORM_VALUES: CreateCredentialFormType = {
  credentialType: CREDENTIAL_TYPES.GIT_REPOSITORY,
  credentialName: "",
  description: "",
  credentialAccountId: "",
  token: "",
};
