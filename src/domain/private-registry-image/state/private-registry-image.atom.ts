import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 내부 레지스트리 이미지 페이지 번호 */
export const privateRegistryImagePageAtom = atomWithReset<number>(1);
/** 내부 레지스트리 이미지 검색어 */
export const privateRegistryImageSearchTextAtom = atom<string>("");
/** 체크된 내부 레지스트리 이미지 목록 */
export const privateRegistryImageCheckedListAtom = atomWithReset<Set<number>>(
  new Set(),
);
/** 내부 레지스트리 이미지 태그 페이지 번호 */
export const privateRegistryImageTagPageAtom = atomWithReset<number>(1);
/** 내부 레지스트리 이미지 태그 검색어 */
export const privateRegistryImageTagSearchTextAtom = atom<string>("");
/** 체크된 내부 레지스트리 이미지 태그 목록 */
export const privateRegistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
/** 내부 레지스트리 이미지 태그 취약점 페이지 번호 */
export const privateRegistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
/** 내부 레지스트리 이미지 생성 모달 표시 여부 */
export const openCreatePrivateRegistryImageModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 태그 생성 모달 표시 여부 */
export const openCreatePrivateRegistryImageTagModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 수정 모달 표시 여부 */
export const openUpdatePrivateRegistryImageModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 삭제 모달 표시 여부 */
export const openDeletePrivateRegistryImageModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 태그 삭제 모달 표시 여부 */
export const openDeletePrivateRegistryImageTagModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 태그 로그 모달 표시 여부 */
export const openPrivateRegistryImageTagLogModalAtom = atom<boolean>(false);
/** 관리자 내부 레지스트리 이미지 태그 페이지 번호 */
export const adminPrivateRegistryImageTagPageAtom = atomWithReset<number>(1);
/** 관리자 내부 레지스트리 이미지 태그 검색어 */
export const adminPrivateRegistryImageTagSearchTextAtom = atom<string>("");
/** 관리자 내부 레지스트리 이미지 태그 취약점 페이지 번호 */
export const adminPrivateRegistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
/** 관리자 내부 레지스트리 이미지 태그 선택된 태그명 */
export const adminPrivateRegistryImageTagSelectedItemAtom = atom<string>("1");
/** 관리자 내부 레지스트리 이미지 태그 체크된 태그 목록 */
export const adminPrivateRegistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
/** 관리자 내부 레지스트리 이미지 삭제 모달 표시 여부 */
export const openDeleteAdminRegistryImageModalAtom = atom<boolean>(false);
