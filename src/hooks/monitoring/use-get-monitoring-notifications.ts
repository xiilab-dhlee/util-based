import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { monitoringKeys } from "@/constants/monitoring/monitoring.key";
import { useServices } from "@/providers/service-provider";
import type { MonitoringNotificationListType } from "@/schemas/monitoring-notification.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetMonitoringNotificationsPayload } from "@/types/monitoring-notification/monitoring-notification.type";

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
