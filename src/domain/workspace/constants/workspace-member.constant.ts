import { keyBy, mapValues } from "es-toolkit";
import type { DropdownOption } from "xiilab-ui";

/**
 * 워크스페이스 멤버 권한 (Single Source of Truth)
 * - value: API 스키마와 일치
 * - label: UI 표시용
 */
export const WORKSPACE_MEMBER_WORKSPACE_AUTHORITY = [
  { value: "OWNER", label: "Owner" },
  { value: "PARTICIPANT", label: "Participant" },
] as const;

export type WorkspaceMemberWorkspaceAuthority =
  (typeof WORKSPACE_MEMBER_WORKSPACE_AUTHORITY)[number]["value"];

/** value → label 매핑 */
export const WORKSPACE_MEMBER_ROLE_LABEL_MAP = mapValues(
  keyBy([...WORKSPACE_MEMBER_WORKSPACE_AUTHORITY], (item) => item.value),
  (item) => item.label,
) as Record<WorkspaceMemberWorkspaceAuthority, string>;

/** value를 label로 변환 (fallback: value 그대로 반환) */
export const getWorkspaceMemberRoleLabel = (
  value: WorkspaceMemberWorkspaceAuthority,
): string => WORKSPACE_MEMBER_ROLE_LABEL_MAP[value] ?? value;

/** 드롭다운 옵션 */
export const WORKSPACE_MEMBER_ROLE_OPTIONS: DropdownOption[] =
  WORKSPACE_MEMBER_WORKSPACE_AUTHORITY.map(({ value, label }) => ({
    value,
    label,
  }));
