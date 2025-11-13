import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import monitoringKeys from "@/constants/monitoring/monitoring.key";
import { useServices } from "@/providers/service-provider";
import type { GetMonitoringNotificationSettingsPayload } from "@/types/monitoring-notification/monitoring-notification.type";

/**
 * 모니터링 알림 설정 목록 조회
 */
export const useGetMonitoringNotificationSettings = (
  payload: GetMonitoringNotificationSettingsPayload,
): UseQueryResult<any, Error> => {
  const { monitoringService } = useServices();

  return useQuery({
    queryKey: monitoringKeys.notificationSettingList(payload),
    queryFn: async () => {
      const response =
        await monitoringService.getNotificationSettingList(payload);
      return response.data;
    },
  });
};

