import type { DropdownOption } from "xiilab-ui";

/**
 * 워크스페이스 단위 권한 타입
 * - OWNER: 워크스페이스를 소유/관리하는 사용자
 * - PARTICIPANT: 워크스페이스에 참여하는 사용자
 *
 * value 값은 API 스키마(대문자)와 일치하도록 관리하고,
 * label 은 UI 에서 노출되는 사람이 읽기 좋은 형태로 분리한다.
 */
export const WORKSPACE_MEMBER_WORKSPACE_AUTHORITY = [
  { value: "OWNER", label: "Owner" },
  { value: "PARTICIPANT", label: "Participant" },
] as const;

export type WorkspaceMemberWorkspaceAuthority =
  (typeof WORKSPACE_MEMBER_WORKSPACE_AUTHORITY)[number]["value"];

/**
 * role value → 사람이 읽기 좋은 label 매핑
 */
export const WORKSPACE_MEMBER_ROLE_LABEL_MAP =
  {
    OWNER: "Owner",
    PARTICIPANT: "Participant",
  } satisfies Record<WorkspaceMemberWorkspaceAuthority, string>;

/**
 * role value 를 받아 label 로 변환
 * - 매핑이 없을 경우 안전하게 value 를 그대로 반환
 */
export const getWorkspaceMemberRoleLabel = (
  value: WorkspaceMemberWorkspaceAuthority,
): string => {
  return WORKSPACE_MEMBER_ROLE_LABEL_MAP[value] ?? value;
};

/**
 * 드롭다운 옵션
 * - 단일 소스 오브 트루스인 WORKSPACE_MEMBER_WORKSPACE_AUTHORITY 를 기반으로 생성한다.
 * - UI select 의 value 가 항상 API 스키마와 일치하도록 보장한다.
 */
export const WORKSPACE_MEMBER_ROLE_OPTIONS: DropdownOption[] =
  WORKSPACE_MEMBER_WORKSPACE_AUTHORITY.map(({ value, label }) => ({
    value,
    label,
  }));
