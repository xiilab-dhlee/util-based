import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 태그 페이지 번호
export const adminPrivateRegistryImageTagPageAtom = atomWithReset<number>(1);
// 검색 필터 - 태그 검색어
export const adminPrivateRegistryImageTagSearchTextAtom = atom<string>("");
// 검색 필터 - 태그 취약점 페이지 번호
export const adminPrivateRegistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
// 선택된 태그명
export const adminPrivateRegistryImageTagSelectedItemAtom = atom<string>("1");
// 체크된 태그 목록
export const adminPrivateRegistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
// 이미지 삭제 모달
export const openDeleteAdminRegistryImageModalAtom = atom<boolean>(false);
