import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { ActiveWorkloadResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { GetWorkloadsPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 워크로드 목록 조회
 *
 */
export const useGetWorkloads = (
  payload: GetWorkloadsPayload,
): UseQueryResult<CoreListResponse<ActiveWorkloadResponse>, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.list(payload),
    queryFn: async () => {
      const response = await workloadService.getList(payload);
      return response.data;
    },
  });
};
