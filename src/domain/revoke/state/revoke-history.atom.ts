import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { RevokeHistoryDetailType } from "@/domain/revoke/types/revoke-history.type";
import { DEFAULT_DATE_RANGE } from "@/shared/constants/core.constant";

// ===== 모달 atom =====

/** 리소스 회수 기준 설정 모달 표시 여부 */
export const openResourceRevokeCriteriaModalAtom = atom<boolean>(false);

// ===== 목록 페이지용 atom =====

/** 리소스 회수 이력 목록 페이지 번호 */
export const revokeHistoryPageAtom = atomWithReset<number>(1);
/** 리소스 회수 이력 목록 날짜 범위 */
export const revokeHistoryDateRangeAtom = atomWithReset(DEFAULT_DATE_RANGE);

// ===== 상세 페이지용 atom =====

/** 리소스 회수 이력 상세 페이지 번호 */
export const revokeHistoryDetailPageAtom = atomWithReset<number>(1);
/** 리소스 회수 이력 상세 날짜 범위 */
export const revokeHistoryDetailDateRangeAtom =
  atomWithReset(DEFAULT_DATE_RANGE);
/** 리소스 회수 이력 상세 구분 (WARNING/REVOKED) */
export const revokeHistoryDetailTypeAtom = atomWithReset<
  RevokeHistoryDetailType | undefined
>(undefined);
