import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

/** 리포트 생성 모달 표시 여부 */
export const openCreateReportModalAtom = atom<boolean>(false);

/** 리포트 삭제 모달 표시 여부 */
export const openDeleteReportModalAtom = atom<boolean>(false);

/** 리포트 페이지 번호 */
export const reportPageAtom = atomWithReset<number>(1);

/** 리포트 타입 필터 (주간/월간) */
export const reportDateTypeAtom = atom<string | undefined>(undefined);

/** 리포트 종류 필터 (시스템/클러스터) */
export const reportTypeAtom = atom<string | undefined>(undefined);

/** 체크된 리포트 목록 */
export const reportCheckedListAtom = atomWithReset<Set<Key>>(new Set());
