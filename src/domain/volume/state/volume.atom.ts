import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type {
  GetVolumeListOrder,
  GetVolumeListSort,
  GetVolumeListVolumeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/shared/state/filetree.atom";

// ============================================================================
// 볼륨 목록 필터 타입
// ============================================================================

/** 정렬 필드와 순서를 조합한 값 (예: "VOLUME_NAME_ASC") */
export type VolumeSortValue = `${GetVolumeListSort}_${GetVolumeListOrder}`;

// ============================================================================
// 볼륨 목록 관련 Atoms
// ============================================================================

/** 볼륨 페이지 번호 */
export const volumePageAtom = atomWithReset<number>(1);
/** 볼륨 정렬 기본값 (최신순) */
export const DEFAULT_VOLUME_SORT: VolumeSortValue = "CREATED_AT_DESC";
/** 볼륨 정렬 (sort_order 조합) */
export const volumeSortAtom =
  atomWithReset<VolumeSortValue>(DEFAULT_VOLUME_SORT);
/** 볼륨 타입 필터 */
export const volumeTypeFilterAtom =
  atomWithReset<GetVolumeListVolumeType | null>(null);
/** 볼륨 검색 키워드 (입력 필드 값) */
export const volumeSearchKeywordAtom = atom<string>("");
/** 볼륨 검색어 (실제 API 요청에 사용) */
export const volumeSearchTextAtom = atom<string>("");
/** 체크된 볼륨 목록 */
export const volumeCheckedListAtom = atomWithReset<Set<number>>(new Set());
/** 볼륨 타입 선택 모달 표시 여부 */
export const openSelectVolumeModalAtom = atom<boolean>(false);
/** 온프레미스 볼륨 생성 모달 표시 여부 */
export const openCreateOnPremiseVolumeModalAtom = atom<boolean>(false);
/** 아스트라고 볼륨 생성 모달 표시 여부 */
export const openCreateAstragoVolumeModalAtom = atom<boolean>(false);
/** 볼륨 삭제 모달 표시 여부 */
export const openDeleteVolumeModalAtom = atom<boolean>(false);
/** 볼륨 파일 삭제 모달 표시 여부 */
export const openDeleteVolumeFileModalAtom = atom<boolean>(false);
/** 볼륨 파일 폴더 생성 모달 표시 여부 */
export const openCreateVolumeFolderModalAtom = atom<boolean>(false);
/** 볼륨 파일 압축 모달 표시 여부 */
export const openCompressVolumeFileModalAtom = atom<boolean>(false);
/** 볼륨 파일 압축 해제 모달 표시 여부 */
export const openDecompressVolumeFileModalAtom = atom<boolean>(false);
/** 볼륨 파일 다운로드 모달 표시 여부 */
export const openDownloadVolumeFileModalAtom = atom<boolean>(false);
/** 볼륨 파일 업로드 모달 표시 여부 */
export const openUploadVolumeFileModalAtom = atom<boolean>(false);
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
