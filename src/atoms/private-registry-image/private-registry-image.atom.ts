import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const privateRegistryImagePageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const privateRegistryImageSearchTextAtom = atom<string>("");
// 체크된 이미지 목록
export const privateRegistryImageCheckedListAtom = atomWithReset<Set<number>>(
  new Set(),
);
// 태그 검색 필터 - 페이지 번호
export const privateRegistryImageTagPageAtom = atomWithReset<number>(1);
// 태그 검색 필터 - 검색어
export const privateRegistryImageTagSearchTextAtom = atom<string>("");
// 체크된 태그 목록
export const privateRegistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
// 태그 취약점 검색 필터 - 페이지 번호
export const privateRegistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
// 내부 레지스트리 이미지 생성 모달 표시 여부
export const openCreatePrivateRegistryImageModalAtom = atom<boolean>(false);
// 내부 레지스트리 이미지 수정 모달 표시 여부
export const openUpdatePrivateRegistryImageModalAtom = atom<boolean>(false);
// 내부 레지스트리 이미지 삭제 모달 표시 여부
export const openDeletePrivateRegistryImageModalAtom = atom<boolean>(false);
// 내부 레지스트리 이미지 태그 삭제 모달 표시 여부
export const openDeletePrivateRegistryImageTagModalAtom = atom<boolean>(false);
// 내부 레지스트리 이미지 태그 로그 모달 표시 여부
export const openPrivateRegistryImageTagLogModalAtom = atom<boolean>(false);
