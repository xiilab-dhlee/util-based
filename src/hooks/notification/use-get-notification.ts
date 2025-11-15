import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import notificationKeys from "@/constants/notification/notification.key";
import { useServices } from "@/providers/service-provider";

/**
 * 알림 상세 조회
 */
export const useGetNotification = (id: string): UseQueryResult<any, Error> => {
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

