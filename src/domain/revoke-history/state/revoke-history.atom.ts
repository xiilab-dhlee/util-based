import { atomWithReset } from "jotai/utils";

import type { RevokeHistoryDetailType } from "@/domain/revoke-history/types/revoke-history.type";

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
export const revokeHistoryDetailTypeAtom =
  atomWithReset<RevokeHistoryDetailType | undefined>(undefined);
