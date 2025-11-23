import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageListType } from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import type { GetAdminInternalRegistryImagesPayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 관리자 내부 레지스트리의 이미지 목록 조회
 */
export const useGetAdminInternalRegistryImages = (
  payload: GetAdminInternalRegistryImagesPayload,
): UseQueryResult<CoreListResponse<InternalRegistryImageListType>, Error> => {
  const { adminInternalRegistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.adminList(payload),
    queryFn: async () => {
      const response = await adminInternalRegistryImageService.getList(payload);
      return response.data;
    },
    enabled: !!payload.registryName,
  });
};
