import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 태그 페이지 번호
export const privateRegistryImageTagPageAtom = atomWithReset<number>(1);
// 검색 필터 - 태그 검색어
export const privateRegistryImageTagSearchTextAtom = atom<string>("");
// 검색 필터 - 태그 취약점 페이지 번호
export const privateRegistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
// 선택된 태그명
export const privateRegistryImageTagSelectedItemAtom = atom<string>("1");
// 체크된 태그 목록
export const privateRegistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
// 이미지 삭제 모달
export const openDeleteRegistryImageModalAtom = atom<boolean>(false);
// 이미지 로그 모달
export const openRegistryImageLogModalAtom = atom<boolean>(false);
