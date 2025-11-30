import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
import { createSelectedGroupTreeNodeAtom } from "@/shared/state/group-tree.atom";

/** 그룹 트리 데이터 */
export const groupTreeDataAtom = atomWithReset<GroupTreeType[]>([]);

/** 그룹 선택된 노드 ID */
export const groupSelectedIdAtom = atomWithReset<string | null>(
  ALL_OPTION.value,
);

/** 그룹 선택된 노드 정보 */
export const groupSelectedInfoAtom = createSelectedGroupTreeNodeAtom(
  groupTreeDataAtom,
  groupSelectedIdAtom,
);

/** 그룹 생성 모달 표시 여부 */
export const openCreateGroupModalAtom = atom<boolean>(false);

/** 그룹 삭제 모달 표시 여부 */
export const openDeleteGroupModalAtom = atom<boolean>(false);

/** 멤버 추가 모달 표시 여부 */
export const openMemberModalAtom = atom<boolean>(false);
