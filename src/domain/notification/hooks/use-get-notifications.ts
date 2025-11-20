import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { notificationKeys } from "@/domain/notification/constants/notification.key";
import type { NotificationListType } from "@/domain/notification/schemas/notification.schema";
import type { GetNotificationsPayload } from "@/domain/notification/types/notification.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
