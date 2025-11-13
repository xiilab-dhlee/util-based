import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateMonitoringNotificationPayload } from "@/types/monitoring-notification/monitoring-notification.type";

/**
 * 모니터링 알림 생성
 */
export const useCreateMonitoringNotification = (): UseMutationResult<
  any,
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

