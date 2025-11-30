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
