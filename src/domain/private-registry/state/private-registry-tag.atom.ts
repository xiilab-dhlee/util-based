import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { PrivateRegistryTagSortState } from "@/domain/private-registry/constants/private-registry-tag.constant";

// ============================================================================
// 프라이빗 레지스트리 태그 관련 상태
// ============================================================================

/** 프라이빗 레지스트리 태그 페이지 번호 */
export const privateRegistryTagPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 태그 검색어 */
export const privateRegistryTagSearchTextAtom = atomWithReset<string>("");
/** 프라이빗 레지스트리 태그 정렬 상태 */
export const privateRegistryTagSortAtom =
  atomWithReset<PrivateRegistryTagSortState>({
    field: "updatedAt",
    order: "descend",
  });
/** 체크된 프라이빗 레지스트리 태그 목록 */
export const privateRegistryTagCheckedListAtom = atomWithReset<Set<Key>>(
  new Set(),
);
/** 프라이빗 레지스트리 태그 삭제 모달 열림 상태 */
export const openDeletePrivateRegistryTagModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 태그 상세 모달 열림 상태 */
export const openViewPrivateRegistryTagDetailModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 태그 생성 모달 열림 상태 */
export const openCreatePrivateRegistryTagModalAtom = atom<boolean>(false);
/** 선택된 프라이빗 레지스트리 태그 ID */
export const privateRegistryTagSelectedAtom =
  atomWithReset<ImageTagListResponse | null>(null);
