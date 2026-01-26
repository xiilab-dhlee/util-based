import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  getAdminNotifications,
  getGetAdminNotificationsQueryKey,
} from "@/api/generated/admin-account-notification/admin-account-notification";
import {
  type GetAdminNotificationsNotificationTypeItem,
  GetAdminNotificationsOrder,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  NOTIFICATION_PAGE_SIZE,
  type NotificationTypeValue,
} from "@/shared/constants/notification";

interface UseInfiniteAdminNotificationsParams {
  /** 읽음 여부 필터. true: 읽은 알림만, false: 읽지 않은 알림만, undefined: 전체 */
  hasRead?: boolean;
  /** 알림 유형 필터 */
  notificationType?: NotificationTypeValue;
}

export function useInfiniteAdminNotifications(
  params?: UseInfiniteAdminNotificationsParams,
) {
  const { hasRead, notificationType } = params ?? {};
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const notificationTypeArray = notificationType
    ? ([notificationType] as GetAdminNotificationsNotificationTypeItem[])
    : undefined;

  const query = useInfiniteQuery({
    queryKey: [
      ...getGetAdminNotificationsQueryKey(accountId, {
        pageNo: 0,
        pageSize: NOTIFICATION_PAGE_SIZE,
        hasRead,
        notificationType: notificationTypeArray,
        order: GetAdminNotificationsOrder.DESC,
      }),
      "infinite",
    ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const backendPageNo = pageParam - 1;

      return getAdminNotifications(
        accountId,
        {
          pageNo: backendPageNo,
          pageSize: NOTIFICATION_PAGE_SIZE,
          hasRead,
          notificationType: notificationTypeArray,
          order: "DESC",
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
