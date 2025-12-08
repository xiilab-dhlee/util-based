import type { MemberRow } from "@/shared/components/column/create-member-column";
import type { GroupTreeNodeType } from "@/shared/schemas/group-tree.schema";

/**
 * 선택된 멤버 타입 (계정과 그룹 구분)
 * 그룹 관리, 워크스페이스 멤버 추가 등에서 공통으로 사용
 */
export interface SelectedMember {
  /** 멤버 ID */
  id: string;
  /** 멤버 이름 */
  name: string;
  /** 이메일 (account인 경우에만) */
  email?: string;
  /** 멤버 타입 */
  type: GroupTreeNodeType;
}

/**
 * 멤버 선택 페이로드 (PubSub 이벤트용)
 * 모달 외부에서 초기 선택된 계정 목록을 전달할 때 사용
 */
export interface MemberSelectionPayload {
  /** 선택된 계정 목록 */
  selectedAccounts: SelectedMember[];
}

/**
 * 멤버 선택 확인 페이로드 (ManageGroupModal로 전달)
 */
export interface ConfirmMemberSelectionPayload {
  /** 평탄화된 멤버 목록 */
  members: MemberRow[];
}
