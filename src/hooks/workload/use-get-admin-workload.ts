import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import workloadKeys from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { WorkloadDetailType } from "@/schemas/workload.schema";
import type { GetWorkloadPayload } from "@/types/workload/workload.type";

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

