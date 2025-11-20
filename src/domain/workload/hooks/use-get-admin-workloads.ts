import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { WorkloadListType } from "@/domain/workload/schemas/workload.schema";
import type { GetWorkloadsPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 관리자 워크로드 목록 조회
 */
export const useGetAdminWorkloads = (
  payload: GetWorkloadsPayload,
): UseQueryResult<CoreListResponse<WorkloadListType>, Error> => {
  const { adminWorkloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.adminList(payload),
    queryFn: async () => {
      const response = await adminWorkloadService.getList(payload);
      return response.data;
    },
  });
};
