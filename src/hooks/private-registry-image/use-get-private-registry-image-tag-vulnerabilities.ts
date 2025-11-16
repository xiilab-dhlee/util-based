import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { VulnerabilityListType } from "@/schemas/vulnerability.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetPrivateRegistryImageVulnerabilityListPayload } from "@/types/private-registry-image/private-registry-image.type";

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
