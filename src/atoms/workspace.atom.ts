import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { WorkspaceIdType } from "@/schemas/workspace.schema";

/** 워크스페이스 페이지 번호 */
export const workspacePageAtom = atomWithReset<number>(1);
/** 워크스페이스 검색어 */
export const workspaceSearchTextAtom = atom<string>("");
/** 워크스페이스 정렬 */
export const workspaceSortAtom = atom<string>("");
/** 체크된 워크스페이스 목록 */
export const workspaceCheckedListAtom = atomWithReset<Set<WorkspaceIdType>>(
  new Set(),
);
