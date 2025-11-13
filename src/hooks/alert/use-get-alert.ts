import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import alertKeys from "@/constants/alert/alert.key";
import { useServices } from "@/providers/service-provider";

/**
 * 알림 상세 조회
 */
export const useGetAlert = (id: string): UseQueryResult<any, Error> => {
  const { alertService } = useServices();

  return useQuery({
    queryKey: alertKeys.detail(id),
    queryFn: async () => {
      const response = await alertService.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};

