import { useQueryClient } from "@tanstack/react-query";

import {
  getGetNotificationsQueryKey,
  useMarkNotificationAsRead,
} from "@/api/generated/account-notification/account-notification";
import {
  getGetAdminNotificationSetsQueryKey,
  getGetAdminNotificationsQueryKey,
  useUpdateAdminNotificationSet,
} from "@/api/generated/admin-account-notification/admin-account-notification";

/**
 * 알림 읽음 처리 액션 훅 (관리자용)
 * 관리자 알림 쿼리를 무효화합니다.
 */
export function useMarkAdminNotificationAsReadAction(
  options?: Parameters<typeof useMarkNotificationAsRead>[0],
) {
  const queryClient = useQueryClient();

  return useMarkNotificationAsRead({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        const [, variables] = args;

        queryClient.invalidateQueries({
          queryKey: getGetAdminNotificationsQueryKey(variables.accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

/**
 * 알림 읽음 처리 액션 훅 (사용자용)
 * 사용자 알림 쿼리를 무효화합니다.
 */
export function useMarkUserNotificationAsReadAction(
  options?: Parameters<typeof useMarkNotificationAsRead>[0],
) {
  const queryClient = useQueryClient();

  return useMarkNotificationAsRead({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        const [, variables] = args;

        // 사용자 알림 쿼리 무효화 (infinite query 포함)
        queryClient.invalidateQueries({
          queryKey: getGetNotificationsQueryKey(variables.accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

/**
 * 알림 설정 업데이트 액션 훅
 */
export function useUpdateAdminNotificationSetAction(
  accountId: string,
  options?: Parameters<typeof useUpdateAdminNotificationSet>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateAdminNotificationSet({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
          queryKey: getGetAdminNotificationSetsQueryKey(accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}
