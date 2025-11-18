import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { WorkloadListType } from "@/schemas/workload.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetWorkloadsPayload } from "@/types/workload/workload.type";

/**
 * 워크로드 목록 조회
 *
 */
export const useGetWorkloads = (
  payload: GetWorkloadsPayload,
): UseQueryResult<CoreListResponse<WorkloadListType>, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.list(payload),
    queryFn: async () => {
      const response = await workloadService.getList(payload);
      return response.data;
    },
  });
};
