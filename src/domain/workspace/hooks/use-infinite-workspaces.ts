import {
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";

import type {
  GetAllWorkspacesParams,
  WorkspaceResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getAllWorkspaces,
  getGetAllWorkspacesQueryKey,
} from "@/api/generated/workspace/workspace";
import { WORKSPACE_PAGE_SIZE } from "@/domain/workspace/constants/workspace.constant";

interface UseInfiniteWorkspacesReturn {
  workspaces: WorkspaceResponse[];
  fetchNextPage: UseInfiniteQueryResult["fetchNextPage"];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: unknown;
  refetch: UseInfiniteQueryResult["refetch"];
}

export function useInfiniteWorkspaces(
  params?: Omit<GetAllWorkspacesParams, "pageNo">,
): UseInfiniteWorkspacesReturn {
  const {
    keyword,
    pageSize = WORKSPACE_PAGE_SIZE,
    hasMyWorkspace,
  } = params ?? {};
  const normalizedKeyword = keyword === "" ? undefined : keyword;

  const query = useInfiniteQuery({
    queryKey: [
      ...getGetAllWorkspacesQueryKey({
        keyword: normalizedKeyword,
        pageSize,
        hasMyWorkspace,
      }),
      "infinite",
    ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const backendPageNo = pageParam - 1;

      return getAllWorkspaces(
        {
          pageNo: backendPageNo,
          pageSize,
          keyword: normalizedKeyword,
          hasMyWorkspace,
        },
        signal,
      );
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;

      const { currentPageNo, totalPageNum } = lastPage;
      const hasMore = currentPageNo < totalPageNum - 1;

      return hasMore ? currentPageNo + 2 : undefined;
    },
    initialPageParam: 1,
  });

  const workspaces =
    query.data?.pages.flatMap((page) => page.content || []) || [];

  return {
    workspaces,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
