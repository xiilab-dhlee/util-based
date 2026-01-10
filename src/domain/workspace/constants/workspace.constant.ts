import type { DropdownOption } from "xiilab-ui";

import {
  WORKSPACE_MEMBER_ROLES,
  type WorkspaceMemberRole,
} from "@/shared/constants/core.constant";

/**
 * 워크스페이스 목록 페이지 크기 (infinite scroll)
 */
export const WORKSPACE_PAGE_SIZE = 10;

/**
 * 워크스페이스 멤버 역할 드롭다운 옵션
 * - value: API 요청/응답과 동일한 key
 * - label: UI 표시용
 */
export const WORKSPACE_MEMBER_ROLE_OPTIONS = [
  { value: WORKSPACE_MEMBER_ROLES.OWNER, label: "Owner" },
  { value: WORKSPACE_MEMBER_ROLES.PARTICIPANT, label: "Participant" },
] as const satisfies readonly DropdownOption[];

export type { WorkspaceMemberRole };

export const normalizeWorkspaceMemberRole = (
  value?: string | null,
): WorkspaceMemberRole => {
  switch (value) {
    case WORKSPACE_MEMBER_ROLES.OWNER:
      return WORKSPACE_MEMBER_ROLES.OWNER;
    case WORKSPACE_MEMBER_ROLES.PARTICIPANT:
      return WORKSPACE_MEMBER_ROLES.PARTICIPANT;
    default:
      return WORKSPACE_MEMBER_ROLES.PARTICIPANT;
  }
};

export const getWorkspaceMemberRoleLabel = (value?: string | null): string => {
  const role = normalizeWorkspaceMemberRole(value);
  return (
    WORKSPACE_MEMBER_ROLE_OPTIONS.find((option) => option.value === role)
      ?.label ?? role
  );
};

export const isWorkspaceOwnerRole = (role?: string | null): boolean =>
  normalizeWorkspaceMemberRole(role) === WORKSPACE_MEMBER_ROLES.OWNER;
