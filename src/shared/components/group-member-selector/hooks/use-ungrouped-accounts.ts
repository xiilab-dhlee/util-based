import { useInfiniteQuery } from "@tanstack/react-query";

import type { PageResponseGroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetUngroupedAccountsQueryKey,
  getUngroupedAccounts,
} from "@/api/generated/group/group";

export const UNGROUPED_PAGE_SIZE = 10;

export function useUngroupedAccounts() {
  const {
    data: ungroupedPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PageResponseGroupMemberResponse,
    Error,
    {
      pages: PageResponseGroupMemberResponse[];
      pageParams: number[];
    },
    ReturnType<typeof getGetUngroupedAccountsQueryKey>,
    number
  >({
    queryKey: getGetUngroupedAccountsQueryKey({
      pageSize: UNGROUPED_PAGE_SIZE,
    }),
    queryFn: async ({ pageParam, signal }) => {
      return await getUngroupedAccounts(
        {
          pageNo: pageParam,
          pageSize: UNGROUPED_PAGE_SIZE,
        },
        signal,
      );
    },
    getNextPageParam: (lastPage) => {
      const current = lastPage.currentPageNo ?? 0;
      const total = lastPage.totalPageNum ?? 0;
      return current < total - 1 ? current + 1 : undefined;
    },
    initialPageParam: 0,
  });

  const allUngroupedAccounts =
    ungroupedPages?.pages.flatMap((page) => page.content ?? []) ?? [];

  return {
    ungroupedAccounts: allUngroupedAccounts,
    fetchNextUngroupedPage: fetchNextPage,
    hasMoreUngrouped: hasNextPage,
    isLoadingMoreUngrouped: isFetchingNextPage,
  };
}
