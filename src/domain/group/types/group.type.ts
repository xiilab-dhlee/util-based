import { MODAL_MODES, type ModalMode } from "@/shared/constants/core.constant";
import type { SelectedMember } from "@/shared/types/member-selection.type";

/**
 * 그룹 생성 모달 payload
 */
export type OpenGroupModalCreatePayload = {
  mode: (typeof MODAL_MODES)["CREATE"];
  isSubGroup?: boolean;
};

/**
 * 그룹 수정 모달 payload
 */
export type OpenGroupModalUpdatePayload = {
  mode: (typeof MODAL_MODES)["UPDATE"];
  groupId: string;
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
  isSubGroup: false,
};

/**
 * 그룹 수정 모달 payload 생성 헬퍼
 * @param groupId - 수정할 그룹 ID
 */
export function createOpenGroupModalUpdatePayload(
  groupId: string,
): OpenGroupModalUpdatePayload {
  return { mode: MODAL_MODES.UPDATE, groupId };
}

/**
 * 멤버 모달 열기 이벤트 payload
 */
export interface OpenMemberModalPayload {
  /** 선택된 계정 목록 */
  selectedAccounts: SelectedMember[];
}
