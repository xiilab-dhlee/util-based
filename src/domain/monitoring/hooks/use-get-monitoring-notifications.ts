import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { monitoringKeys } from "@/domain/monitoring/constants/monitoring.key";
import type { GetMonitoringNotificationsPayload } from "@/domain/monitoring-notification/types/monitoring-notification.type";
import type { MonitoringNotificationListType } from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 모니터링 알림 목록 조회
 */
export const useGetMonitoringNotifications = (
  payload: GetMonitoringNotificationsPayload,
): UseQueryResult<CoreListResponse<MonitoringNotificationListType>, Error> => {
  const { monitoringService } = useServices();

  return useQuery({
    queryKey: monitoringKeys.notificationList(payload),
    queryFn: async () => {
      const response = await monitoringService.getNotificationList(payload);
      return response.data;
    },
  });
};
