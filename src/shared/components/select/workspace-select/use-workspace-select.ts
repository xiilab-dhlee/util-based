import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useInfiniteWorkspaces } from "@/domain/workspace/hooks/use-infinite-workspaces";
import { useWorkspaceSwitch } from "@/domain/workspace/hooks/use-workspace-switch";
import { ROUTES } from "@/shared/constants/routes.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { openCreateFirstWorkspaceModalAtom } from "@/shared/state/modal.atom";
import {
  getStoredWorkspaceId,
  setStoredWorkspaceId,
} from "@/shared/utils/storage/workspace-session-storage.util";
import { selectInitialWorkspace } from "@/shared/utils/workspace.util";

const isWorkspaceValid = (
  workspaceId: number | undefined,
  workspaces: WorkspaceResponse[],
): boolean => {
  if (!workspaceId) return false;
  return workspaces.some((ws) => ws.workspaceId === workspaceId);
};

export function useWorkspaceSelect(searchKeyword: string) {
  const { selectedWorkspace, isLoading, handleSelectWorkspace } =
    useWorkspaceSwitch();

  const [, setSelectedWorkspace] = useAtom(selectedWorkspaceAtom);
  const setOpenCreateFirstWorkspaceModal = useSetAtom(
    openCreateFirstWorkspaceModalAtom,
  );

  const router = useRouter();

  const {
    workspaces,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingWorkspaces,
    error,
    refetch,
  } = useInfiniteWorkspaces({ keyword: searchKeyword });

  const currentWorkspaceId = selectedWorkspace?.workspaceId;

  useEffect(() => {
    if (error) {
      router.push(ROUTES.WORKSPACE_ERROR);
    }
  }, [error, router]);

  useEffect(() => {
    if (searchKeyword) return;

    if (isLoadingWorkspaces) return;

    if (!workspaces.length) {
      setOpenCreateFirstWorkspaceModal(true);
      return;
    }

    if (isWorkspaceValid(currentWorkspaceId, workspaces)) return;

    const initialWorkspace = selectInitialWorkspace(
      workspaces,
      getStoredWorkspaceId(),
    );

    setSelectedWorkspace(initialWorkspace);
    setStoredWorkspaceId(initialWorkspace.workspaceId);
  }, [
    searchKeyword,
    currentWorkspaceId,
    workspaces,
    isLoadingWorkspaces,
    setSelectedWorkspace,
    setOpenCreateFirstWorkspaceModal,
  ]);

  return {
    selectedWorkspace,
    workspaces,
    isLoading,
    handleSelectWorkspace,
    refetchWorkspaces: refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
