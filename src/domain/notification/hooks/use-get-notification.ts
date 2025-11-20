import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { notificationKeys } from "@/domain/notification/constants/notification.key";
import type { NotificationDetailType } from "@/domain/notification/schemas/notification.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 알림 상세 조회
 */
export const useGetNotification = (
  id: string,
): UseQueryResult<NotificationDetailType, Error> => {
  const { notificationService } = useServices();

  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: async () => {
      const response = await notificationService.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};
