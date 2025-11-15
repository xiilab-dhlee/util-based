import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageTagListType } from "@/schemas/private-registry-image-tag.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetPrivateRegistryImageTagsPayload } from "@/types/private-registry-image/private-registry-image.type";

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
  });
};
