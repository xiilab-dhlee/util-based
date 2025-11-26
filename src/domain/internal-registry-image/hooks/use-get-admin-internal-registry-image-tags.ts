import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageTagListType } from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import type { GetAdminInternalRegistryImageTagsPayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 관리자 내부 레지스트리의 이미지 태그 목록 조회
 */
export const useGetAdminInternalRegistryImageTags = (
  payload: GetAdminInternalRegistryImageTagsPayload,
): UseQueryResult<
  CoreListResponse<InternalRegistryImageTagListType>,
  Error
> => {
  const { adminInternalRegistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.adminTagList(payload),
    queryFn: async () => {
      const response =
        await adminInternalRegistryImageService.getTagList(payload);
      return response.data;
    },
  });
};
