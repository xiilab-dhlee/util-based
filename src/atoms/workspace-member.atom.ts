import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 워크스페이스 멤버 페이지 번호 */
export const workspaceMemberPageAtom = atomWithReset<number>(1);
/** 워크스페이스 멤버 검색어 */
export const workspaceMemberSearchTextAtom = atom<string>("");
/** 체크된 워크스페이스 멤버 목록 */
export const workspaceMemberCheckedListAtom = atomWithReset<Set<string>>(
  new Set(),
);
/** 워크스페이스 멤버 수정 모달 열림/닫힘 상태 */
export const openUpdateWorkspaceMemberModalAtom = atom<boolean>(false);
/** 워크스페이스 멤버 삭제 모달 열림/닫힘 상태 */
export const openDeleteWorkspaceMemberModalAtom = atom<boolean>(false);
