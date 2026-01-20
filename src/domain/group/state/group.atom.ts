import { atom } from "jotai";

import type { ItemType } from "@/shared/components/group-member-selector/types";

/** 그룹 생성 모달 표시 여부 */
export const openCreateGroupModalAtom = atom<boolean>(false);

/** 그룹 삭제 모달 표시 여부 */
export const openDeleteGroupModalAtom = atom<boolean>(false);

/** 그룹에 멤버가 존재하여 삭제 불가 모달 표시 여부 */
export const openGroupHasMembersModalAtom = atom<boolean>(false);

/** 멤버 추가 모달 표시 여부 */
export const openMemberModalAtom = atom<boolean>(false);

/** 선택된 그룹/계정 (왼쪽 트리뷰에서 선택한 항목) */
export const selectedItemAtom = atom<{
  id: string;
  type: ItemType;
} | null>(null);
