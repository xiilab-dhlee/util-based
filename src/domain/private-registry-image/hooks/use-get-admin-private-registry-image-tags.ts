import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import type { GetAdminPrivateRegistryImageTagsPayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageTagListType } from "@/domain/private-registry-image/schemas/private-registry-image-tag.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 관리자 내부 레지스트리의 이미지 태그 목록 조회
 */
export const useGetAdminPrivateRegistryImageTags = (
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
