import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { RevokeCriteriaItemType } from "@/domain/revoke/schemas/revoke-history.schema";
import type { RevokeHistoryDetailType } from "@/domain/revoke/types/revoke-history.type";

// ===== 모달 atom =====

/** 리소스 회수 기준 설정 모달 표시 여부 */
export const openResourceRevokeCriteriaModalAtom = atom<boolean>(false);

/** 리소스 회수 기준 설정 모달에서 수정할 기준 데이터 */
export const selectedRevokeCriteriaAtom = atom<
  RevokeCriteriaItemType | undefined
>(undefined);

// ===== 목록 페이지용 atom =====

/** 리소스 회수 이력 목록 페이지 번호 */
export const revokeHistoryPageAtom = atomWithReset<number>(1);
/** 리소스 회수 이력 목록 시작일 */
export const revokeHistoryStartDateAtom = atomWithReset<string>("");
/** 리소스 회수 이력 목록 종료일 */
export const revokeHistoryEndDateAtom = atomWithReset<string>("");

// ===== 상세 페이지용 atom =====

/** 리소스 회수 이력 상세 페이지 번호 */
export const revokeHistoryDetailPageAtom = atomWithReset<number>(1);
/** 리소스 회수 이력 상세 시작일 */
export const revokeHistoryDetailStartDateAtom = atomWithReset<string>("");
/** 리소스 회수 이력 상세 종료일 */
export const revokeHistoryDetailEndDateAtom = atomWithReset<string>("");
/** 리소스 회수 이력 상세 구분 (WARNING/REVOKED) */
export const revokeHistoryDetailTypeAtom = atomWithReset<
  RevokeHistoryDetailType | undefined
>(undefined);
