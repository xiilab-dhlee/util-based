import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { WorkloadDetailType } from "@/domain/workload/schemas/workload.schema";
import type { GetWorkloadPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";

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
