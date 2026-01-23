import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { VolumeFilterRequestVolumeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { VOLUME_DEFAULT_SORT } from "@/domain/volume/constants/volume.constant";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/shared/state/filetree.atom";

// ============================================================================
// 볼륨 목록 관련 Atoms
// ============================================================================

/** 볼륨 페이지 번호 */
export const volumePageAtom = atomWithReset<number>(1);
/** 볼륨 정렬 (sort_order 조합) */
export const volumeOrderSortAtom = atomWithReset<string>(VOLUME_DEFAULT_SORT);
/** 볼륨 타입 필터 */
export const volumeTypeSortAtom =
  atomWithReset<VolumeFilterRequestVolumeType | null>(null);
/** 볼륨 검색 키워드 (입력 필드 값) */
export const volumeSearchKeywordAtom = atom<string>("");
/** 볼륨 검색어 (실제 API 요청에 사용) */
export const volumeSearchTextAtom = atom<string>("");
/** 체크된 볼륨 목록 */
export const volumeCheckedListAtom = atomWithReset<Set<number>>(new Set());

/** 볼륨 파일 페이지 번호 */
export const volumeFilePageAtom = atomWithReset<number>(1);

/** 볼륨 파일 트리 데이터 */
export const volumeFileTreeDataAtom = atomWithReset<FileTreeType[]>([]);

/** 볼륨 파일 선택된 노드 키 */
export const volumeFileSelectedKeyAtom = atomWithReset<React.Key>(
  ALL_OPTION.value,
);

/** 볼륨 파일 체크된 노드들 */
export const volumeFileCheckedNodesAtom = atomWithReset<Set<string>>(new Set());

/** 볼륨 파일 선택된 노드 정보 */
export const volumeFileSelectedNodeInfoAtom = createSelectedNodeInfoAtom(
  volumeFileTreeDataAtom,
  volumeFileSelectedKeyAtom,
);

/** 볼륨 파일 체크된 노드들 정보 */
export const volumeFileCheckedNodesInfoAtom = createCheckedNodesInfoAtom(
  volumeFileTreeDataAtom,
  volumeFileCheckedNodesAtom,
);
