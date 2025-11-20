import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { GetPrivateRegistryImageVulnerabilityListPayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 내 이미지 태그 취약점 목록 조회
 */
export const useGetPrivateRegistryImageTagVulnerabilities = (
  payload: GetPrivateRegistryImageVulnerabilityListPayload,
): UseQueryResult<CoreListResponse<VulnerabilityListType>, Error> => {
  const { privateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.tagVulnerabilityList(payload),
    queryFn: async () => {
      const response =
        await privateRegistryImageService.getTagVulnerabilityList(payload);
      return response.data;
    },
    enabled: !!payload.imageId && !!payload.tagId,
  });
};
