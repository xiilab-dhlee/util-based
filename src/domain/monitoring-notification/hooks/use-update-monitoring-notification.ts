import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { monitoringKeys } from "@/domain/monitoring-notification/constants/monitoring-notification.key";
import type { UpdateMonitoringNotificationPayload } from "@/domain/monitoring-notification/types/monitoring-notification.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 모니터링 알림 수정
 */
export const useUpdateMonitoringNotification = (): UseMutationResult<
  unknown,
  Error,
  UpdateMonitoringNotificationPayload,
  unknown
> => {
  const { monitoringService } = useServices();

  return useMutation({
    mutationKey: monitoringKeys.update(),
    mutationFn: (payload: UpdateMonitoringNotificationPayload) => {
      return monitoringService.updateNotification(payload);
    },
  });
};
