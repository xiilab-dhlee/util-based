import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import { workloadKeys } from "@/domain/workload/constants/workload.key";
import type { GetWorkloadVulnerabilitiesPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
