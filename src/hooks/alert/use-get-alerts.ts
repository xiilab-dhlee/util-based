import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import alertKeys from "@/constants/alert/alert.key";
import { useServices } from "@/providers/service-provider";
import type { GetAlertsPayload } from "@/types/alert/alert.type";

/**
 * 알림 목록 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
 */
export const useGetAlerts = (
  payload: GetAlertsPayload,
): UseQueryResult<any, Error> => {
  const { alertService } = useServices();

  return useQuery({
    queryKey: alertKeys.list(payload),
    queryFn: async () => {
      const response = await alertService.getList(payload);
      return response.data;
    },
  });
};

