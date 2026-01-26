import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  getGetNotificationsQueryKey,
  getNotifications,
} from "@/api/generated/account-notification/account-notification";
import { NOTIFICATION_PAGE_SIZE } from "@/shared/constants/notification";

interface UseInfiniteNotificationsParams {
  /** 읽음 여부 필터. true: 읽은 알림만, false: 읽지 않은 알림만, undefined: 전체 */
  hasRead?: boolean;
  /** 워크스페이스 ID 필터 */
  workspaceId?: number;
}

export function useInfiniteNotifications(
  params?: UseInfiniteNotificationsParams,
) {
  const { hasRead, workspaceId } = params ?? {};
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const query = useInfiniteQuery({
    queryKey: [
      ...getGetNotificationsQueryKey(accountId, {
        pageNo: 0,
        pageSize: NOTIFICATION_PAGE_SIZE,
        hasRead,
        workspaceId,
      }),
      "infinite",
    ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const backendPageNo = pageParam - 1;

      return getNotifications(
        accountId,
        {
          pageNo: backendPageNo,
          pageSize: NOTIFICATION_PAGE_SIZE,
          hasRead,
          workspaceId,
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
    enabled: Boolean(accountId),
  });

  const notifications =
    query.data?.pages.flatMap((page) => page?.content || []) || [];
  const totalSize = query.data?.pages[0]?.totalSize ?? 0;

  return {
    notifications,
    totalSize,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
