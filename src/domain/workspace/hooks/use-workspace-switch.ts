import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getGetWorkspaceDetailQueryKey } from "@/api/generated/workspace/workspace";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import {
  getDynamicRouteBasePath,
  getWorkspaceSwitchRoute,
} from "@/shared/utils/router.util";
import { setStoredWorkspaceId } from "@/shared/utils/storage/workspace-session-storage.util";

export function useWorkspaceSwitch() {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedWorkspace, setSelectedWorkspace] = useAtom(
    selectedWorkspaceAtom,
  );

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const updateWorkspaceState = (workspace: WorkspaceResponse) => {
    setSelectedWorkspace(workspace);
    setStoredWorkspaceId(workspace.workspaceId);
  };

  const invalidateAllCache = async (newWorkspaceId: number) => {
    await queryClient.cancelQueries();
    queryClient.removeQueries({
      predicate: (query) => {
        const newWorkspaceDetailKey =
          getGetWorkspaceDetailQueryKey(newWorkspaceId);
        const queryKeyStr = String(query.queryKey[0]);
        const detailKeyStr = String(newWorkspaceDetailKey[0]);

        // 새 워크스페이스의 detail 쿼리는 보존
        return !queryKeyStr.includes(detailKeyStr);
      },
    });
  };

  const navigateAfterSwitch = () => {
    const isDynamicRoute = params && Object.keys(params).length > 0;

    const targetPath = isDynamicRoute
      ? getDynamicRouteBasePath(pathname)
      : getWorkspaceSwitchRoute(pathname);

    if (targetPath !== pathname) {
      router.push(targetPath);
    }
  };

  const handleSelectWorkspace = async (workspace: WorkspaceResponse) => {
    if (selectedWorkspace?.workspaceId === workspace.workspaceId) {
      return false;
    }

    setIsLoading(true);

    try {
      updateWorkspaceState(workspace);
      await invalidateAllCache(workspace.workspaceId).catch(console.error);
      navigateAfterSwitch();

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedWorkspace,
    isLoading,
    handleSelectWorkspace,
  };
}
