import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageTagListType } from "@/schemas/private-registry-image-tag.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetAdminPrivateRegistryImageTagsPayload } from "@/types/private-registry-image/private-registry-image.type";

/**
 * 관리자 내부 레지스트리의 이미지 태그 목록 조회
 */
export const useGetPrivateRegistryImageTags = (
  payload: GetAdminPrivateRegistryImageTagsPayload,
): UseQueryResult<CoreListResponse<PrivateRegistryImageTagListType>, Error> => {
  const { adminPrivateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.adminTagList(payload),
    queryFn: async () => {
      const response =
        await adminPrivateRegistryImageService.getTagList(payload);
      return response.data;
    },
  });
};
