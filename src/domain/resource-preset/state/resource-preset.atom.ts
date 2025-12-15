import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import type { CoreNodeMode } from "@/shared/types/core.interface";

/** 리소스 프리셋 페이지 번호 */
export const resourcePresetPageAtom = atomWithReset<number>(1);

/** 리소스 프리셋 검색어 */
export const resourcePresetSearchTextAtom = atomWithReset<string>("");

/** 리소스 프리셋 Job Type 필터 */
export const resourcePresetJobTypeAtom = atom<WorkloadJobType | undefined>(
  undefined,
);

/** 리소스 프리셋 Node Type 필터 */
export const resourcePresetNodeTypeAtom = atom<CoreNodeMode | undefined>(
  undefined,
);

/** 체크된 리소스 프리셋 목록 */
export const resourcePresetCheckedListAtom = atomWithReset<Set<Key>>(new Set());

/** 리소스 프리셋 삭제 모달 열기 상태 */
export const openDeleteResourcePresetModalAtom = atom<boolean>(false);
