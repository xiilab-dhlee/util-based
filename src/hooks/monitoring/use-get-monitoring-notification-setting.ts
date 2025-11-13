import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import monitoringKeys from "@/constants/monitoring/monitoring.key";
import { useServices } from "@/providers/service-provider";

/**
 * 모니터링 알림 설정 상세 조회
 */
export const useGetMonitoringNotificationSetting = (
  id: string,
): UseQueryResult<any, Error> => {
  const { monitoringService } = useServices();

  return useQuery({
    queryKey: monitoringKeys.notificationSettingDetail(id),
    queryFn: async () => {
      const response = await monitoringService.getNotificationSettingDetail(id);
      return response.data;
    },
  });
};

