import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { WorkloadDetailType } from "@/domain/workload/schemas/workload.schema";
import type { GetWorkloadPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 관리자 워크로드 상세 조회
 */
export const useGetAdminWorkload = (
  payload: GetWorkloadPayload,
): UseQueryResult<WorkloadDetailType, Error> => {
  const { adminWorkloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.adminDetail(payload),
    queryFn: async () => {
      const response = await adminWorkloadService.getDetail(payload);
      return response.data;
    },
  });
};
