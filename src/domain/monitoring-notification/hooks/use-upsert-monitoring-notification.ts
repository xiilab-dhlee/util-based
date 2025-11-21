import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpsertMonitoringNotificationPayload } from "@/domain/monitoring-notification/types/monitoring-notification.type";
import { useServices } from "@/shared/providers/service-provider";

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
