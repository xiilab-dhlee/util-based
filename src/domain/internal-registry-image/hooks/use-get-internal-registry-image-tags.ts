import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageTagListType } from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import type { GetInternalRegistryImageTagsPayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 내 이미지 목록 조회
 */
export const useGetInternalRegistryImageTags = (
  payload: GetInternalRegistryImageTagsPayload,
): UseQueryResult<
  CoreListResponse<InternalRegistryImageTagListType>,
  Error
> => {
  const { internalregistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.tagList(payload),
    queryFn: async () => {
      const response = await internalregistryImageService.getTagList(payload);
      return response.data;
    },
    enabled: !!payload.imageId,
  });
};
