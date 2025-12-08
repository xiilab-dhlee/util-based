import type {
  OpenGroupModalPayload,
  OpenGroupModalUpdatePayload,
} from "@/domain/group/types/group.type";
import { MODAL_MODES } from "@/shared/constants/core.constant";

/**
 * 그룹 모달 payload가 수정 모드인지 확인하는 타입 가드
 */
export function isUpdatePayload(
  payload: OpenGroupModalPayload,
): payload is OpenGroupModalUpdatePayload {
  return payload.mode === MODAL_MODES.UPDATE;
}
