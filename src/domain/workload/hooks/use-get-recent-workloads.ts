import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import type { GetWorkloadsPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 최근 워크로드 목록 조회
 *
 */
export const useGetRecentWorkloads = (
  payload: GetWorkloadsPayload,
  enabled: boolean,
): UseQueryResult<CoreListResponse<WorkloadListType>, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.recentList(payload),
    queryFn: async () => {
      const response = await workloadService.getList(payload);
      return response.data;
    },
    enabled,
  });
};
