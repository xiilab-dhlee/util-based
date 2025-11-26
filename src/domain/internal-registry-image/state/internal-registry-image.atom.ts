import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 내부 레지스트리 이미지 페이지 번호 */
export const internalregistryImagePageAtom = atomWithReset<number>(1);
/** 내부 레지스트리 이미지 검색어 */
export const internalregistryImageSearchTextAtom = atom<string>("");
/** 체크된 내부 레지스트리 이미지 목록 */
export const internalregistryImageCheckedListAtom = atomWithReset<Set<number>>(
  new Set(),
);
/** 내부 레지스트리 이미지 태그 페이지 번호 */
export const internalregistryImageTagPageAtom = atomWithReset<number>(1);
/** 내부 레지스트리 이미지 태그 검색어 */
export const internalregistryImageTagSearchTextAtom = atom<string>("");
/** 체크된 내부 레지스트리 이미지 태그 목록 */
export const internalregistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
/** 내부 레지스트리 이미지 태그 취약점 페이지 번호 */
export const internalregistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
/** 내부 레지스트리 이미지 생성 모달 표시 여부 */
export const openCreateInternalRegistryImageModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 태그 생성 모달 표시 여부 */
export const openCreateInternalRegistryImageTagModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 수정 모달 표시 여부 */
export const openUpdateInternalRegistryImageModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 삭제 모달 표시 여부 */
export const openDeleteInternalRegistryImageModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 태그 삭제 모달 표시 여부 */
export const openDeleteInternalRegistryImageTagModalAtom = atom<boolean>(false);
/** 내부 레지스트리 이미지 태그 로그 모달 표시 여부 */
export const openInternalRegistryImageTagLogModalAtom = atom<boolean>(false);
/** 관리자 내부 레지스트리 이미지 태그 페이지 번호 */
export const adminInternalRegistryImageTagPageAtom = atomWithReset<number>(1);
/** 관리자 내부 레지스트리 이미지 태그 검색어 */
export const adminInternalRegistryImageTagSearchTextAtom = atom<string>("");
/** 관리자 내부 레지스트리 이미지 태그 취약점 페이지 번호 */
export const adminInternalRegistryImageTagVulnerabilityPageAtom =
  atomWithReset<number>(1);
/** 관리자 내부 레지스트리 이미지 태그 선택된 태그명 */
export const adminInternalRegistryImageTagSelectedItemAtom = atom<string>("1");
/** 관리자 내부 레지스트리 이미지 태그 체크된 태그 목록 */
export const adminInternalRegistryImageTagCheckedListAtom = atomWithReset<
  Set<number>
>(new Set());
/** 관리자 내부 레지스트리 이미지 삭제 모달 표시 여부 */
export const openDeleteAdminRegistryImageModalAtom = atom<boolean>(false);
