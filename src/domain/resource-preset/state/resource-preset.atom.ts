import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type {
  GetPresetsNodeType,
  GetPresetsOrder,
  GetPresetsSort,
  GetPresetsWorkloadJobType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 리소스 프리셋 Job Type 필터 타입 (ALL 포함) */
export type ResourcePresetJobTypeFilter = GetPresetsWorkloadJobType | undefined;

/** 리소스 프리셋 Node Type 필터 타입 (ALL 포함) */
export type ResourcePresetNodeTypeFilter = GetPresetsNodeType | undefined;

/** 리소스 프리셋 페이지 번호 */
export const resourcePresetPageAtom = atomWithReset<number>(1);

/** 리소스 프리셋 검색어 */
export const resourcePresetSearchTextAtom = atomWithReset<string>("");

export const resourcePresetJobTypeAtom =
  atomWithReset<ResourcePresetJobTypeFilter>(undefined);

/** 리소스 프리셋 Node Type 필터 */
export const resourcePresetNodeTypeAtom =
  atomWithReset<ResourcePresetNodeTypeFilter>(undefined);

export const resourcePresetSortAtom = atomWithReset<GetPresetsSort | undefined>(
  undefined,
);

export const resourcePresetOrderAtom = atomWithReset<
  GetPresetsOrder | undefined
>(undefined);

/** 체크된 리소스 프리셋 목록 */
export const resourcePresetCheckedListAtom = atomWithReset<Set<Key>>(new Set());

/** 리소스 프리셋 삭제 모달 열기 상태 */
export const openDeleteResourcePresetModalAtom = atom<boolean>(false);
