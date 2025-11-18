import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpsertMonitoringNotificationPayload } from "@/types/monitoring-notification/monitoring-notification.type";

/**
 * 모니터링 알림 생성/수정
 */
export const useUpsertMonitoringNotification = (): UseMutationResult<
  unknown,
  Error,
  UpsertMonitoringNotificationPayload,
  unknown
> => {
  const { monitoringService } = useServices();

  return useMutation({
    mutationFn: (payload: UpsertMonitoringNotificationPayload) => {
      if (payload.id) {
        return monitoringService.updateNotification(payload);
      } else {
        return monitoringService.createNotification(payload);
      }
    },
  });
};
