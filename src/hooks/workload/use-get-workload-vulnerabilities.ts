import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workloadKeys } from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { VulnerabilityListType } from "@/schemas/vulnerability.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetWorkloadVulnerabilitiesPayload } from "@/types/workload/workload.type";

/**
 * 워크로드 보안 취약점 조회
 */
export const useGetWorkloadVulnerabilities = (
  payload: GetWorkloadVulnerabilitiesPayload,
): UseQueryResult<CoreListResponse<VulnerabilityListType>, Error> => {
  const { workloadService } = useServices();

  return useQuery({
    queryKey: workloadKeys.vulnerabilityList(payload),
    queryFn: async () => {
      const response = await workloadService.getVulnerabilities(payload);

      return response.data;
    },
  });
};
