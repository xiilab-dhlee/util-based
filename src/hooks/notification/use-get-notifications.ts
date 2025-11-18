import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { notificationKeys } from "@/constants/notification/notification.key";
import { useServices } from "@/providers/service-provider";
import type { NotificationListType } from "@/schemas/notification.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetNotificationsPayload } from "@/types/notification/notification.type";

/**
 * 알림 목록 조회
 *
 */
export const useGetNotifications = (
  payload: GetNotificationsPayload,
): UseQueryResult<CoreListResponse<NotificationListType>, Error> => {
  const { notificationService } = useServices();

  return useQuery({
    queryKey: notificationKeys.list(payload),
    queryFn: async () => {
      const response = await notificationService.getList(payload);
      return response.data;
    },
  });
};
