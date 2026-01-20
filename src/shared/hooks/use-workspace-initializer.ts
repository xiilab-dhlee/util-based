import { useAtom, useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useInfiniteWorkspaces } from "@/domain/workspace/hooks/use-infinite-workspaces";
import { useWorkspaceSwitch } from "@/domain/workspace/hooks/use-workspace-switch";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { openCreateFirstWorkspaceModalAtom } from "@/shared/state/modal.atom";
import { isAdminMode } from "@/shared/utils/router.util";
import { getStoredWorkspaceId } from "@/shared/utils/storage/workspace-session-storage.util";
import { selectInitialWorkspace } from "@/shared/utils/workspace.util";

export function useWorkspaceInitializer() {
  const pathname = usePathname();
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom);
  const { handleSelectWorkspace } = useWorkspaceSwitch();
  const { workspaces, isLoading } = useInfiniteWorkspaces({ keyword: "" });
  const setOpenCreateFirstWorkspaceModal = useSetAtom(
    openCreateFirstWorkspaceModalAtom,
  );

  const isAdmin = isAdminMode(pathname);

  useEffect(() => {
    if (isAdmin) return;
    if (isLoading) return;

    if (selectedWorkspace) {
      const isValid = workspaces.some(
        (ws) => ws.workspaceId === selectedWorkspace.workspaceId,
      );
      if (isValid) return;
    }

    if (!workspaces.length) {
      setOpenCreateFirstWorkspaceModal(true);
      return;
    }

    const workspace = selectInitialWorkspace(
      workspaces,
      getStoredWorkspaceId(),
    );

    handleSelectWorkspace(workspace, { skipNavigation: true });
  }, [
    isAdmin,
    isLoading,
    workspaces,
    selectedWorkspace,
    handleSelectWorkspace,
    setOpenCreateFirstWorkspaceModal,
  ]);
}
