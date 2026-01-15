import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useInfiniteWorkspaces } from "@/domain/workspace/hooks/use-infinite-workspaces";
import { useWorkspaceSwitch } from "@/domain/workspace/hooks/use-workspace-switch";
import { ROUTES } from "@/shared/constants/routes.constant";

export function useWorkspaceSelect(
  searchKeyword: string,
  hasMyWorkspace?: boolean,
) {
  const { selectedWorkspace, isLoading, handleSelectWorkspace } =
    useWorkspaceSwitch();

  const router = useRouter();

  const {
    workspaces,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteWorkspaces({ keyword: searchKeyword, hasMyWorkspace });

  // 에러 시 에러 페이지로 이동
  useEffect(() => {
    if (error) {
      router.push(ROUTES.WORKSPACE_ERROR);
    }
  }, [error, router]);

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
