import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageListType } from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import type { GetInternalRegistryImagesPayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 내 이미지 목록 조회
 */
export const useGetInternalRegistryImages = (
  payload: GetInternalRegistryImagesPayload,
): UseQueryResult<CoreListResponse<InternalRegistryImageListType>, Error> => {
  const { internalregistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.list(payload),
    queryFn: async () => {
      const response = await internalregistryImageService.getList(payload);
      return response.data;
    },
  });
};
