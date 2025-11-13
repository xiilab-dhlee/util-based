import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import monitoringKeys from "@/constants/monitoring/monitoring.key";
import { useServices } from "@/providers/service-provider";
import type { GetMonitoringNotificationsPayload } from "@/types/monitoring-notification/monitoring-notification.type";

/**
 * 모니터링 알림 목록 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
 */
export const useGetMonitoringNotifications = (
  payload: GetMonitoringNotificationsPayload,
): UseQueryResult<any, Error> => {
  const { monitoringService } = useServices();

  return useQuery({
    queryKey: monitoringKeys.notificationList(payload),
    queryFn: async () => {
      const response = await monitoringService.getNotificationList(payload);
      return response.data;
    },
  });
};

