import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageTagDetailType } from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import type { GetInternalRegistryImageTagDetailPayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 태그 상세 조회
 */
export const useGetInternalRegistryImageTag = (
  payload: GetInternalRegistryImageTagDetailPayload,
): UseQueryResult<InternalRegistryImageTagDetailType, Error> => {
  const { internalregistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.tagDetail(payload),
    queryFn: async () => {
      const response = await internalregistryImageService.getTagDetail(payload);
      return response.data;
    },
    enabled: !!payload.imageId && !!payload.tagId,
  });
};
