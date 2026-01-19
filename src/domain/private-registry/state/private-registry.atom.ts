import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { PrivateRegistrySortState } from "@/domain/private-registry/constants/private-registry.constant";

// ============================================================================
// 프라이빗 레지스트리 목록 관련 상태
// ============================================================================

/** 프라이빗 레지스트리 페이지 번호 */
export const privateRegistryPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 검색 키워드 (입력 중) */
export const privateRegistrySearchKeywordAtom = atom<string>("");
/** 프라이빗 레지스트리 검색어 (검색 실행) */
export const privateRegistrySearchTextAtom = atomWithReset<string>("");
/** 프라이빗 레지스트리 정렬 상태 */
export const privateRegistrySortAtom = atom<PrivateRegistrySortState>({
  field: "createdAt",
  order: "descend",
});
/** 프라이빗 레지스트리 이미지 소스 타입 필터 */
export const privateRegistryImageSourceTypeAtom = atomWithReset<
  GetPrivateRegistryListImageSourceType | undefined
>(undefined);
/** 선택된 프라이빗 레지스트리 Harbor 이미지 경로 */
export const privateRegistrySelectedItemAtom = atom<string>("");
/** 체크된 프라이빗 레지스트리 목록 */
export const privateRegistryCheckedListAtom = atomWithReset<Set<Key>>(
  new Set(),
);
/** 프라이빗 레지스트리 구분 선택 모달 열림 상태 */
export const openSelectPrivateRegistryTypeModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 생성 모달 열림 상태 */
export const openCreatePrivateRegistryModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 삭제 모달 열림 상태 */
export const openDeletePrivateRegistryModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 로그 모달 열림 상태 */
export const openPrivateRegistryLogModalAtom = atom<boolean>(false);
/** 컨테이너 이미지 등록 재시작 모달 열림 상태 */
export const openRestartPrivateRegistryModalAtom = atom<boolean>(false);
/** 컨테이너 이미지 등록 종료 모달 열림 상태 */
export const openStopPrivateRegistryModalAtom = atom<boolean>(false);

// ============================================================================
// 이미지 등록 Job 관련 상태
// ============================================================================

/** 이미지 등록 Job 페이지 번호 */
export const imageJobPageAtom = atomWithReset<number>(1);
/** 이미지 등록 Job 검색 키워드 (입력 중) */
export const imageJobSearchKeywordAtom = atom<string>("");
/** 이미지 등록 Job 검색어 (검색 실행) */
export const imageJobSearchTextAtom = atomWithReset<string>("");
/** 이미지 등록 Job 이미지 소스 타입 필터 */
export const imageJobImageSourceTypeAtom = atomWithReset<
  GetPrivateRegistryListImageSourceType | undefined
>(undefined);
