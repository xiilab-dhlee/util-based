import type { DropdownOption } from "xiilab-ui";

import type {
  AccountSortRequestSort,
  AccountUpdateRequestAccountRole,
  SignupRequestSortRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AccountUpdateRequestAccountRole as API_ACCOUNT_ROLE_VALUES } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ACCOUNT_ROLE_LABEL } from "@/shared/constants/core.constant";
import type { AntdTableSortState } from "@/shared/types/core.model";

export const ACCOUNT_SORT_FIELD_MAP = {
  accountName: "ACCOUNT_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, AccountSortRequestSort>;

export const SIGNUP_REQUEST_SORT_FIELD_MAP = {
  accountName: "ACCOUNT_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, SignupRequestSortRequestSort>;

/** 계정 정렬 필드 배열 */
export const ACCOUNT_SORT_FIELDS = ["accountName", "createdAt"] as const;

/** 가입 신청 정렬 필드 배열 */
export const SIGNUP_REQUEST_SORT_FIELDS = ["accountName", "createdAt"] as const;

/** 계정 정렬 필드 타입  */
export type AccountSortField = keyof typeof ACCOUNT_SORT_FIELD_MAP;

/** 가입 신청 정렬 필드 타입 (SIGNUP_REQUEST_SORT_FIELD_MAP에서 자동 추론) */
export type SignupRequestSortField = keyof typeof SIGNUP_REQUEST_SORT_FIELD_MAP;

/** 계정 정렬 상태 타입 */
export type AccountSortState = AntdTableSortState<AccountSortField>;

/** 가입 신청 정렬 상태 타입 */
export type SignupRequestSortState = AntdTableSortState<SignupRequestSortField>;

type AccountRoleOptionMap = {
  [Role in AccountUpdateRequestAccountRole]: DropdownOption;
};

/** 계정 권한 드롭다운 옵션 */
const ACCOUNT_ROLE_OPTIONS_MAP = {
  SUPER_ADMIN: {
    value: API_ACCOUNT_ROLE_VALUES.SUPER_ADMIN,
    label: ACCOUNT_ROLE_LABEL.SUPER_ADMIN,
  },
  ADMIN: {
    value: API_ACCOUNT_ROLE_VALUES.ADMIN,
    label: ACCOUNT_ROLE_LABEL.ADMIN,
  },
  USER: { value: API_ACCOUNT_ROLE_VALUES.USER, label: ACCOUNT_ROLE_LABEL.USER },
} as const satisfies AccountRoleOptionMap;

export const ACCOUNT_ROLE_OPTIONS = Object.values(ACCOUNT_ROLE_OPTIONS_MAP);

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

export const getAccountStatusKeyFromBoolean = (
  value: boolean | undefined,
): AccountStatusKey | undefined => {
  if (value === undefined) return undefined;
  return value ? "true" : "false";
};

export const getAccountStatusLabelFromBoolean = (
  value: boolean | undefined,
): string | undefined => {
  if (value === undefined) return undefined;
  return ACCOUNT_STATUS_LABEL_BY_BOOLEAN[value ? "true" : "false"];
};
