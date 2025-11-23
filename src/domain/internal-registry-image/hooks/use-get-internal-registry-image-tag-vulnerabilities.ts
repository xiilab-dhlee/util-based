import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { GetInternalRegistryImageVulnerabilityListPayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 내 이미지 태그 취약점 목록 조회
 */
export const useGetInternalRegistryImageTagVulnerabilities = (
  payload: GetInternalRegistryImageVulnerabilityListPayload,
): UseQueryResult<CoreListResponse<VulnerabilityListType>, Error> => {
  const { internalregistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.tagVulnerabilityList(payload),
    queryFn: async () => {
      const response =
        await internalregistryImageService.getTagVulnerabilityList(payload);
      return response.data;
    },
    enabled: !!payload.imageId && !!payload.tagId,
  });
};
