import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type {
  ResourcePresetJobType,
  ResourcePresetNodeType,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import type { AllOptionValue } from "@/shared/constants/core.constant";

/** 리소스 프리셋 Job Type 필터 타입 (ALL 포함) */
export type ResourcePresetJobTypeFilter =
  | ResourcePresetJobType
  | AllOptionValue
  | undefined;

/** 리소스 프리셋 Node Type 필터 타입 (ALL 포함) */
export type ResourcePresetNodeTypeFilter =
  | ResourcePresetNodeType
  | AllOptionValue
  | undefined;

/** 리소스 프리셋 페이지 번호 */
export const resourcePresetPageAtom = atomWithReset<number>(1);

/** 리소스 프리셋 검색어 */
export const resourcePresetSearchTextAtom = atomWithReset<string>("");

/** 리소스 프리셋 Job Type 필터 */
export const resourcePresetJobTypeAtom =
  atomWithReset<ResourcePresetJobTypeFilter>(undefined);

/** 리소스 프리셋 Node Type 필터 */
export const resourcePresetNodeTypeAtom =
  atomWithReset<ResourcePresetNodeTypeFilter>(undefined);

/** 체크된 리소스 프리셋 목록 */
export const resourcePresetCheckedListAtom = atomWithReset<Set<Key>>(new Set());

/** 리소스 프리셋 삭제 모달 열기 상태 */
export const openDeleteResourcePresetModalAtom = atom<boolean>(false);
