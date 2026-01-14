import { atom } from "jotai";

/** 그룹 생성 모달 표시 여부 */
export const openCreateGroupModalAtom = atom<boolean>(false);

/** 그룹 삭제 모달 표시 여부 */
export const openDeleteGroupModalAtom = atom<boolean>(false);

/** 멤버 추가 모달 표시 여부 */
export const openMemberModalAtom = atom<boolean>(false);
