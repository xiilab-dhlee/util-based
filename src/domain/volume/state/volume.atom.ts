import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/shared/hooks/filetree.atom";

/** 볼륨 페이지 번호 */
export const volumePageAtom = atomWithReset<number>(1);
/** 볼륨 검색어 */
export const volumeSearchTextAtom = atom<string>("");
/** 체크된 볼륨 목록 */
export const volumeCheckedListAtom = atomWithReset<Set<string>>(new Set());
/** 선택된 볼륨 */
export const volumeSelectedAtom = atom<string | null>(null);
/** 볼륨 타입 선택 모달 표시 여부 */
export const openSelectVolumeModalAtom = atom<boolean>(false);
/** 온프레미스 볼륨 생성 모달 표시 여부 */
export const openCreateOnPremiseVolumeModalAtom = atom<boolean>(false);
/** 아스트라고 볼륨 생성 모달 표시 여부 */
export const openCreateAstragoVolumeModalAtom = atom<boolean>(false);
/** 볼륨 삭제 모달 표시 여부 */
export const openDeleteVolumeModalAtom = atom<boolean>(false);
/** 볼륨 파일 폴더 생성 모달 표시 여부 */
export const openCreateVolumeFolderModalAtom = atom<boolean>(false);
/** 볼륨 파일 압축 모달 표시 여부 */
export const openCompressVolumeFileModalAtom = atom<boolean>(false);
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
