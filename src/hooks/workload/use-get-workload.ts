import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { WorkloadDetailType } from "@/schemas/workload.schema";
import type { GetWorkloadPayload } from "@/types/workload/workload.type";

/**
 * 워크로드 상세 조회
 */
export const useGetWorkload = (
  payload: GetWorkloadPayload,
): UseQueryResult<WorkloadDetailType, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.detail(payload),
    queryFn: async () => {
      const response = await workloadService.getDetail(payload);
      return response.data;
    },
  });
};
