import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { WorkloadDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { GetWorkloadPayload } from "@/domain/workload/types/workload.type";
import { useLazyQuery } from "@/shared/hooks/use-lazy-query";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크로드 상세 조회
 */
export const useGetWorkload = (
  payload: GetWorkloadPayload,
): UseQueryResult<WorkloadDetailResponse, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.detail(payload),
    queryFn: async () => {
      const response = await workloadService.getDetail(payload);
      return response.data;
    },
  });
};

export const useGetWorkloadLazy = () => {
  const { workloadService } = useServices();

  return useLazyQuery({
    queryFn: async (payload: GetWorkloadPayload) => {
      const response = await workloadService.getDetail(payload);
      return response.data;
    },
  });
};
