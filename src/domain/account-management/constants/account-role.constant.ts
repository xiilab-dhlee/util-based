import type { DropdownOption } from "xiilab-ui";

import {
  ACCOUNT_ROLES,
  type AccountRole,
} from "@/shared/constants/core.constant";

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
