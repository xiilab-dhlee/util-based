import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateMonitoringNotificationPayload } from "@/domain/monitoring-notification/types/monitoring-notification.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 모니터링 알림 생성
 */
export const useCreateMonitoringNotification = (): UseMutationResult<
  unknown,
  Error,
  CreateMonitoringNotificationPayload,
  unknown
> => {
  const { monitoringService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateMonitoringNotificationPayload) => {
      return monitoringService.createNotification(payload);
    },
  });
};
