import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageTagListType } from "@/domain/private-registry-image/schemas/private-registry-image-tag.schema";
import type { GetPrivateRegistryImageTagsPayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 내 이미지 목록 조회
 */
export const useGetPrivateRegistryImageTags = (
  payload: GetPrivateRegistryImageTagsPayload,
): UseQueryResult<CoreListResponse<PrivateRegistryImageTagListType>, Error> => {
  const { privateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.tagList(payload),
    queryFn: async () => {
      const response = await privateRegistryImageService.getTagList(payload);
      return response.data;
    },
    enabled: !!payload.imageId,
  });
};
