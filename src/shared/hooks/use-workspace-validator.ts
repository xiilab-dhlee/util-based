import { useAtom, useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useGetWorkspaceDetail } from "@/api/generated/workspace/workspace";
import { useInfiniteWorkspaces } from "@/domain/workspace/hooks/use-infinite-workspaces";
import { useWorkspaceSwitch } from "@/domain/workspace/hooks/use-workspace-switch";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { openCreateFirstWorkspaceModalAtom } from "@/shared/state/modal.atom";
import { getStoredWorkspaceId } from "@/shared/utils/storage/workspace-session-storage.util";
import { selectInitialWorkspace } from "@/shared/utils/workspace.util";

export function useWorkspaceValidator() {
  const pathname = usePathname();
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom);
  const { handleSelectWorkspace } = useWorkspaceSwitch();
  const { workspaces, isLoading } = useInfiniteWorkspaces({ keyword: "" });
  const setOpenCreateFirstWorkspaceModal = useSetAtom(
    openCreateFirstWorkspaceModalAtom,
  );

  const workspaceId = selectedWorkspace?.workspaceId;

  const { error, refetch } = useGetWorkspaceDetail(workspaceId ?? 0, {
    query: {
      enabled: Boolean(workspaceId),
      refetchInterval: 60000,
      refetchOnWindowFocus: (query) => !query.state.error,
      retry: 1,
    },
  });

  useEffect(() => {
    if (!pathname) return;
    if (workspaceId) {
      refetch();
    }
  }, [pathname, refetch, workspaceId]);

  useEffect(() => {
    if (!error) return;
    if (isLoading) return;

    if (!workspaces.length) {
      setOpenCreateFirstWorkspaceModal(true);
      return;
    }

    const fallback = selectInitialWorkspace(workspaces, getStoredWorkspaceId());
    handleSelectWorkspace(fallback);
  }, [
    error,
    isLoading,
    workspaces,
    setOpenCreateFirstWorkspaceModal,
    handleSelectWorkspace,
  ]);
}
