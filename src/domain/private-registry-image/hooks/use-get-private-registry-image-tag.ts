import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { GetPrivateRegistryImageTagDetailPayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageTagDetailType } from "@/domain/private-registry-image/schemas/private-registry-image-tag.schema";
import { useServices } from "@/shared/providers/service-provider";

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
