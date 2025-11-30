import type { GroupListType } from "@/domain/group/schemas/group.schema";
import { MODAL_MODES, type ModalMode } from "@/shared/constants/core.constant";
import type { GroupTreeNodeType } from "@/shared/schemas/group-tree.schema";

/**
 * 그룹 생성 모달 payload
 */
export type OpenGroupModalCreatePayload = {
  mode: (typeof MODAL_MODES)["CREATE"];
};

/**
 * 그룹 수정 모달 payload
 */
export type OpenGroupModalUpdatePayload = {
  mode: (typeof MODAL_MODES)["UPDATE"];
  data: GroupListType;
};

/**
 * 그룹 생성/수정 모달 열기 이벤트 payload
 */
export type OpenGroupModalPayload =
  | OpenGroupModalCreatePayload
  | OpenGroupModalUpdatePayload;

/**
 * 그룹 생성/수정 모달 모드
 */
export type GroupModalMode = ModalMode;

/**
 * 그룹 생성 모달 payload 상수
 */
export const OPEN_GROUP_MODAL_CREATE_PAYLOAD: OpenGroupModalCreatePayload = {
  mode: MODAL_MODES.CREATE,
};

/**
 * 그룹 수정 모달 payload 생성 헬퍼
 * @param data - 수정할 그룹 데이터
 */
export function createOpenGroupModalUpdatePayload(
  data: GroupListType,
): OpenGroupModalUpdatePayload {
  return { mode: MODAL_MODES.UPDATE, data };
}

/**
 * 그룹 폼 에러 타입
 */
export interface GroupFormErrors {
  name?: string;
  description?: string;
  members?: string;
}

/**
 * 선택된 멤버 타입 (계정과 그룹 구분)
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
 * 멤버 모달 열기 이벤트 payload
 */
export interface OpenMemberModalPayload {
  /** 선택된 계정 목록 */
  selectedAccounts: SelectedMember[];
  /** 선택된 그룹 목록 */
  selectedGroups: SelectedMember[];
}
