import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { toast } from "react-toastify";

import {
  getGetAllMonitoringNotificationSetsQueryKey,
  getGetMonitoringNotificationSetDetailQueryKey,
  useCreateMonitoringNotificationSet,
  useDeleteMonitoringNotificationSet,
  useUpdateMonitoringNotificationSet,
  useUpdateMonitoringNotificationSetEnabled,
} from "@/api/generated/admin-monitoring-notification-set/admin-monitoring-notification-set";
import { monitoringNotificationSettingPageAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";

/**
 * 모니터링 알림 설정 생성 액션
 */
export function useCreateNotificationAction(
  options?: Parameters<typeof useCreateMonitoringNotificationSet>[0],
) {
  const queryClient = useQueryClient();

  return useCreateMonitoringNotificationSet({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetAllMonitoringNotificationSetsQueryKey(),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

/**
 * 모니터링 알림 설정 수정 액션
 */
export function useUpdateNotificationAction(
  options?: Parameters<typeof useUpdateMonitoringNotificationSet>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateMonitoringNotificationSet({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetAllMonitoringNotificationSetsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetMonitoringNotificationSetDetailQueryKey(
            variables.notificationSetId,
          ),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

/**
 * 모니터링 알림 설정 삭제 액션
 */
export function useDeleteNotificationAction(
  options?: Parameters<typeof useDeleteMonitoringNotificationSet>[0],
) {
  const queryClient = useQueryClient();
  const setPage = useSetAtom(monitoringNotificationSettingPageAtom);

  return useDeleteMonitoringNotificationSet({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        setPage(RESET);
        queryClient.invalidateQueries({
          queryKey: getGetAllMonitoringNotificationSetsQueryKey(),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

/**
 * 모니터링 알림 설정 활성화/비활성화 액션
 */
export function useToggleNotificationEnabledAction(
  options?: Parameters<typeof useUpdateMonitoringNotificationSetEnabled>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateMonitoringNotificationSetEnabled({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        const message = variables.data.hasEnabled
          ? "알림이 활성화되었습니다."
          : "알림이 비활성화되었습니다.";
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: getGetAllMonitoringNotificationSetsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetMonitoringNotificationSetDetailQueryKey(
            variables.notificationSetId,
          ),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}
