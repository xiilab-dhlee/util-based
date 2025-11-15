import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import notificationKeys from "@/constants/notification/notification.key";
import { useServices } from "@/providers/service-provider";
import type { GetNotificationsPayload } from "@/types/notification/notification.type";

/**
 * 알림 목록 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
 */
export const useGetNotifications = (
  payload: GetNotificationsPayload,
): UseQueryResult<any, Error> => {
  const { notificationService } = useServices();

  return useQuery({
    queryKey: notificationKeys.list(payload),
    queryFn: async () => {
      const response = await notificationService.getList(payload);
      return response.data;
    },
  });
};

