import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import type { WorkspaceSortField } from "@/domain/workspace/constants/workspace.constant";
import {
  workspaceCheckedListAtom,
  workspacePageAtom,
  workspaceSearchTextAtom,
  workspaceSortAtom,
} from "@/domain/workspace/state/workspace.atom";
import type { AntdTableSortState } from "@/shared/types/core.model";

export interface WorkspaceListResetFunctions {
  resetForSearch: () => void;
  resetForPageChange: () => void;
  resetForSort: (sort: AntdTableSortState<WorkspaceSortField>) => void;
  resetAll: () => void;
}

export function useWorkspaceListReset(): WorkspaceListResetFunctions {
  const resetPage = useResetAtom(workspacePageAtom);
  const resetCheckedList = useResetAtom(workspaceCheckedListAtom);
  const resetSort = useResetAtom(workspaceSortAtom);
  const resetSearchText = useSetAtom(workspaceSearchTextAtom);
  const setSort = useSetAtom(workspaceSortAtom);

  return {
    resetForSearch: () => {
      resetPage();
      resetCheckedList();
    },

    resetForPageChange: () => {
      resetCheckedList();
    },

    resetForSort: (sort: AntdTableSortState<WorkspaceSortField>) => {
      resetPage();
      setSort(sort);
    },

    resetAll: () => {
      resetPage();
      resetCheckedList();
      resetSort();
      resetSearchText("");
    },
  };
}
