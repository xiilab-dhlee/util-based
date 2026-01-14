import type { DropdownOption } from "xiilab-ui";

import type { WorkspaceSortRequestSort } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  WORKSPACE_MEMBER_ROLES,
  type WorkspaceMemberRole,
} from "@/shared/constants/core.constant";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 워크스페이스 목록 페이지 크기 (infinite scroll)
 */
export const WORKSPACE_PAGE_SIZE = 10;

/** 워크스페이스 정렬 필드 배열 */
export const WORKSPACE_SORT_FIELDS = [
  "workspaceName",
  "creatorName",
  "createdAt",
] as const;

/** 워크스페이스 정렬 필드 매핑 (UI 필드명 -> API 필드명) */
export const WORKSPACE_SORT_FIELD_MAP = {
  workspaceName: "WORKSPACE_NAME",
  creatorName: "CREATOR_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, WorkspaceSortRequestSort>;

export type WorkspaceSortField = keyof typeof WORKSPACE_SORT_FIELD_MAP;

export const DEFAULT_WORKSPACE_SORT_STATE = {
  field: "workspaceName",
  order: "ascend",
} satisfies AntdTableSortState<WorkspaceSortField>;

/**
 * 워크스페이스 멤버 역할 드롭다운 옵션
 * - value: API 요청/응답과 동일한 key
 * - label: UI 표시용
 */
export const WORKSPACE_MEMBER_ROLE_LABELS = {
  [WORKSPACE_MEMBER_ROLES.OWNER]: "Owner",
  [WORKSPACE_MEMBER_ROLES.PARTICIPANT]: "Participant",
} as const satisfies Record<WorkspaceMemberRole, string>;

export const WORKSPACE_MEMBER_ROLE_OPTIONS = [
  {
    value: WORKSPACE_MEMBER_ROLES.OWNER,
    label: WORKSPACE_MEMBER_ROLE_LABELS[WORKSPACE_MEMBER_ROLES.OWNER],
  },
  {
    value: WORKSPACE_MEMBER_ROLES.PARTICIPANT,
    label: WORKSPACE_MEMBER_ROLE_LABELS[WORKSPACE_MEMBER_ROLES.PARTICIPANT],
  },
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
  return WORKSPACE_MEMBER_ROLE_LABELS[role] ?? role;
};

export const isWorkspaceOwnerRole = (role?: string | null): boolean => {
  return normalizeWorkspaceMemberRole(role) === WORKSPACE_MEMBER_ROLES.OWNER;
};
