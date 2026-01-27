import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { GetSourceCodeListCodeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  SOURCECODE_DEFAULT_SORT,
  type SourcecodeSortState,
} from "@/domain/sourcecode/constants/sourcecode.constant";

// ============================================================================
// 소스코드 목록 관련 Atoms
// ============================================================================

/** 소스코드 페이지 번호 */
export const sourcecodePageAtom = atomWithReset<number>(1);
/** 소스코드 테이블 정렬 상태 (AccountListMain 패턴) */
export const sourcecodeSortAtom = atomWithReset<SourcecodeSortState>(
  SOURCECODE_DEFAULT_SORT,
);
/** 소스코드 타입 필터 */
export const sourcecodeTypeSortAtom =
  atomWithReset<GetSourceCodeListCodeType | null>(null);
/** 소스코드 검색 키워드 (입력 필드 값) */
export const sourcecodeSearchKeywordAtom = atom<string>("");
/** 소스코드 검색어 (실제 API 요청에 사용) */
export const sourcecodeSearchTextAtom = atom<string>("");
/** 내 항목만 보기 필터 (user 모드 전용) */
export const sourcecodeHasMineAtom = atomWithReset<boolean>(false);
/** 체크된 소스코드 목록 */
export const sourcecodeCheckedListAtom = atomWithReset<Set<Key>>(new Set());
