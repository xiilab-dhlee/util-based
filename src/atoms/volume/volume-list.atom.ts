import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const volumePageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const volumeSearchTextAtom = atom<string>("");
// 체크된 볼륨 목록
export const volumeCheckedListAtom = atomWithReset<Set<string>>(new Set());
// 선택된 볼륨
export const volumeSelectedAtom = atom<string | null>(null);
// 볼륨 타입 선택 모달 표시 여부
export const openSelectVolumeModalAtom = atom<boolean>(false);
// 볼륨 생성 모달 표시 여부
export const openCreateOnPremiseVolumeModalAtom = atom<boolean>(false);
export const openCreateAstragoVolumeModalAtom = atom<boolean>(false);
// 볼륨 삭제 모달 표시 여부
export const openDeleteVolumeModalAtom = atom<boolean>(false);
// 볼륨 파일 폴더 추가 모달 표시 여부
export const openCreateVolumeFolderModalAtom = atom<boolean>(false);
// 볼륨 파일 압축 모달 표시 여부
export const openCompressVolumeFileModalAtom = atom<boolean>(false);
