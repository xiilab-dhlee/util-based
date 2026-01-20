import { useQueryClient } from "@tanstack/react-query";

import { useMarkNotificationAsRead } from "@/api/generated/account-notification/account-notification";
import {
  getGetAdminNotificationSetsQueryKey,
  getGetAdminNotificationsQueryKey,
  useUpdateAdminNotificationSet,
} from "@/api/generated/admin-account-notification/admin-account-notification";

/**
 * 알림 읽음 처리 액션 훅
 */
export function useMarkNotificationAsReadAction(
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
