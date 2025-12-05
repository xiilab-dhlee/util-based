import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { registrySecurityKeys } from "@/domain/security/constants/registry-security.key";
import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import type { GetRegistrySecurityVulnerabilityListPayload } from "@/domain/security/types/registry-security.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 레지스트리 보안 이미지 태그 취약점 목록 조회
 */
export const useGetRegistrySecurityTagVulnerabilities = (
  payload: GetRegistrySecurityVulnerabilityListPayload,
): UseQueryResult<CoreListResponse<VulnerabilityListType>, Error> => {
  const { registrySecurityService } = useServices();

  return useQuery({
    queryKey: registrySecurityKeys.tagVulnerabilityList(payload),
    queryFn: async () => {
      const response =
        await registrySecurityService.getTagVulnerabilityList(payload);
      return response.data;
    },
    enabled: !!payload.imageId && !!payload.tagId,
  });
};
