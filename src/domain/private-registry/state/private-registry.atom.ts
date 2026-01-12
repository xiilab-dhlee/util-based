import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import {
  RegistryImageFilterRequestOrder,
  RegistryImageFilterRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { PrivateRegistrySortState } from "@/domain/private-registry/constants/private-registry.constant";

/** 프라이빗 레지스트리 페이지 번호 */
export const privateregistryPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 검색 키워드 (입력 중) */
export const privateregistrySearchKeywordAtom = atom<string>("");
/** 프라이빗 레지스트리 검색어 (검색 실행) */
export const privateregistrySearchTextAtom = atomWithReset<string>("");
/** 프라이빗 레지스트리 정렬 상태 */
export const privateregistrySortAtom = atom<PrivateRegistrySortState>({
  field: RegistryImageFilterRequestSort.CREATED_AT,
  order: RegistryImageFilterRequestOrder.DESC,
});
/** 선택된 프라이빗 레지스트리 Harbor 이미지 경로 */
export const privateregistrySelectedItemAtom = atom<string>("");
/** 프라이빗 레지스트리 이미지 페이지 번호 */
export const privateregistryImagePageAtom = atomWithReset<number>(1);
/** 체크된 프라이빗 레지스트리 목록 */
export const privateregistryCheckedListAtom = atomWithReset<Set<Key>>(
  new Set(),
);
/** 프라이빗 레지스트리 이미지 생성 모달 열림 상태 */
export const openCreatePrivateRegistryModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 이미지 삭제 모달 열림 상태 */
export const openDeletePrivateRegistryModalAtom = atom<boolean>(false);
