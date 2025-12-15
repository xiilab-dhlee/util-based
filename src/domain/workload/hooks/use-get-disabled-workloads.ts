import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { DisabledWorkloadListType } from "@/domain/workload/schemas/workload.schema";
import type { GetWorkloadsPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 비활성화 워크로드 목록 조회
 *
 */
export const useGetDisabledWorkloads = (
  payload: GetWorkloadsPayload,
): UseQueryResult<CoreListResponse<DisabledWorkloadListType>, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.disabledList(payload),
    queryFn: async () => {
      const response = await workloadService.getList({
        ...payload,
        status: "COMPLETED",
      });
      return response.data;
    },
  });
};
