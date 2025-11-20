import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { monitoringKeys } from "@/domain/monitoring-notification/constants/monitoring-notification.key";
import type { MonitoringNotificationDetailType } from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 모니터링 알림 설정 상세 조회
 */
export const useGetMonitoringNotification = (
  id: string,
): UseQueryResult<MonitoringNotificationDetailType, Error> => {
  const { monitoringService } = useServices();

  return useQuery({
    queryKey: monitoringKeys.notificationSettingDetail(id),
    queryFn: async () => {
      const response = await monitoringService.getNotificationDetail(id);
      return response.data;
    },
  });
};
