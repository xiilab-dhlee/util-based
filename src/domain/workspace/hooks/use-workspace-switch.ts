import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import {
  getDynamicRouteBasePath,
  getWorkspaceSwitchRoute,
} from "@/shared/utils/router.util";
import { setStoredWorkspaceId } from "@/shared/utils/storage/workspace-session-storage.util";

interface SelectWorkspaceOptions {
  skipNavigation?: boolean;
}

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

  const invalidateAllCache = () => {
    queryClient.invalidateQueries();
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

  const handleSelectWorkspace = (
    workspace: WorkspaceResponse,
    options?: SelectWorkspaceOptions,
  ) => {
    if (selectedWorkspace?.workspaceId === workspace.workspaceId) {
      return false;
    }

    setIsLoading(true);

    try {
      updateWorkspaceState(workspace);
    } catch (error) {
      console.error("Workspace state update failed:", error);
      setIsLoading(false);
      return false;
    }

    try {
      invalidateAllCache();
    } catch (error) {
      console.warn("Cache invalidation failed:", error);
    }

    if (!options?.skipNavigation) {
      try {
        navigateAfterSwitch();
      } catch (error) {
        console.warn("Navigation failed:", error);
      }
    }

    setIsLoading(false);
    return true;
  };

  return {
    selectedWorkspace,
    isLoading,
    handleSelectWorkspace,
  };
}
