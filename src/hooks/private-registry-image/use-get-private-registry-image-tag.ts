import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageTagDetailType } from "@/schemas/private-registry-image-tag.schema";
import type { GetPrivateRegistryImageTagDetailPayload } from "@/types/private-registry-image/private-registry-image.type";

/**
 * 내부 레지스트리 이미지 태그 상세 조회
 */
export const useGetPrivateRegistryImageTag = (
  payload: GetPrivateRegistryImageTagDetailPayload,
): UseQueryResult<PrivateRegistryImageTagDetailType, Error> => {
  const { privateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.tagDetail(payload),
    queryFn: async () => {
      const response = await privateRegistryImageService.getTagDetail(payload);
      return response.data;
    },
    enabled: !!payload.imageId && !!payload.tagId,
  });
};
