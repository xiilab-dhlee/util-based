import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type {
  GetPrivateRegistryListImageSourceType,
  ImageJobResponseImageSourceType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistrySortState } from "@/domain/registry/constants/registry-list.constant";

// ============================================================================
// 레지스트리 목록 관련 상태
// ============================================================================

/** 레지스트리 페이지 번호 */
export const registryPageAtom = atomWithReset<number>(1);
/** 레지스트리 검색어 (검색 실행) */
export const registrySearchTextAtom = atomWithReset<string>("");
/** 레지스트리 정렬 상태 */
export const registrySortAtom = atomWithReset<RegistrySortState>({
  field: "createdAt",
  order: "descend",
});
/** 레지스트리 이미지 소스 타입 필터 */
export const registryImageSourceTypeAtom = atomWithReset<
  GetPrivateRegistryListImageSourceType | undefined
>(undefined);
/** 선택된 레지스트리 Harbor 이미지 경로 */
export const registrySelectedItemAtom = atom<string>("");
/** 체크된 레지스트리 목록 */
export const registryCheckedListAtom = atomWithReset<Set<Key>>(new Set());

// ============================================================================
// 이미지 등록 Job 관련 상태
// ============================================================================

/** 이미지 등록 Job 페이지 번호 */
export const imageJobPageAtom = atomWithReset<number>(1);
/** 이미지 등록 Job 검색어 (검색 실행) */
export const imageJobSearchTextAtom = atomWithReset<string>("");
/** 이미지 등록 Job 이미지 소스 타입 필터 */
export const imageJobImageSourceTypeAtom = atomWithReset<
  ImageJobResponseImageSourceType | undefined
>(undefined);
