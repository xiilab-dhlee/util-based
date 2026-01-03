import type { DropdownOption } from "xiilab-ui";

import type {
  AccountSortRequestSort,
  SignupRequestSortRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ACCOUNT_ROLES,
  type AccountRole,
} from "@/shared/constants/core.constant";
import type { AntdTableSortState } from "@/shared/types/core.model";

export const ACCOUNT_SORT_FIELD_MAP = {
  accountName: "ACCOUNT_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, AccountSortRequestSort>;

export const SIGNUP_REQUEST_SORT_FIELD_MAP = {
  accountName: "ACCOUNT_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, SignupRequestSortRequestSort>;

/** 계정 정렬 필드 타입  */
export type AccountSortField = keyof typeof ACCOUNT_SORT_FIELD_MAP;

/** 가입 신청 정렬 필드 타입 (SIGNUP_REQUEST_SORT_FIELD_MAP에서 자동 추론) */
export type SignupRequestSortField = keyof typeof SIGNUP_REQUEST_SORT_FIELD_MAP;

/** 계정 정렬 상태 타입 */
export type AccountSortState = AntdTableSortState<AccountSortField>;

/** 가입 신청 정렬 상태 타입 */
export type SignupRequestSortState = AntdTableSortState<SignupRequestSortField>;

/** 계정 권한 라벨 매핑 */
export const ACCOUNT_ROLE_LABEL: Record<AccountRole, string> = {
  [ACCOUNT_ROLES.SUPER_ADMIN]: "SUPER-ADMIN",
  [ACCOUNT_ROLES.ADMIN]: "ADMIN",
  [ACCOUNT_ROLES.USER]: "USER",
};

/** 계정 권한 드롭다운 옵션 */
export const ACCOUNT_ROLE_OPTIONS: DropdownOption[] = Object.entries(
  ACCOUNT_ROLE_LABEL,
).map(([value, label]) => ({
  value,
  label,
}));

/** 계정 상태 옵션 */
export const ACCOUNT_STATUS_OPTIONS: DropdownOption[] = [
  { value: "true", label: "활성화" },
  { value: "false", label: "비활성화" },
];

/** 계정 상태 라벨 매핑 (boolean 기반) */
export const ACCOUNT_STATUS_LABEL_BY_BOOLEAN = {
  true: "활성화",
  false: "비활성화",
} as const;

type AccountStatusKey = keyof typeof ACCOUNT_STATUS_LABEL_BY_BOOLEAN;

/** boolean 값을 상태 라벨 키("true" | "false")로 변환 */
export const getAccountStatusKeyFromBoolean = (
  value: boolean,
): AccountStatusKey => (value ? "true" : "false");

/** boolean 값을 상태 라벨("활성화" | "비활성화")로 변환 */
export const getAccountStatusLabelFromBoolean = (value: boolean): string =>
  ACCOUNT_STATUS_LABEL_BY_BOOLEAN[getAccountStatusKeyFromBoolean(value)];
