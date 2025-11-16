import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import registryKeys from "@/constants/registry/private-registry.key";
import { useServices } from "@/providers/service-provider";
import type { GetPrivateRegistryImageTagVulnerabilityListPayload } from "@/types/private-registry/private-registry.type";
import type { Vulnerability } from "@/types/security/security.model";

/**
 * 내부 레지스트리 내 이미지 태그 취약점 목록 조회
 */
export const useGetPrivateRegistryImageTagVulnerabilities = (
  payload: GetPrivateRegistryImageTagVulnerabilityListPayload,
): UseQueryResult<{ content: Vulnerability[]; total: number }, Error> => {
  const { privateRegistryService } = useServices();

  return useQuery({
    queryKey: registryKeys.privateRegistryImageTagVulnerabilityList(payload),
    queryFn: async () => {
      const { content, total } =
        await privateRegistryService.getPrivateRegistryImageTagVulnerabilities(
          payload,
        );

      return { content, total };
    },
    enabled: !!payload.tagId,
  });
};
