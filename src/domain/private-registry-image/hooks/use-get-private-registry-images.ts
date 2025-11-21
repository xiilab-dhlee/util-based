import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageListType } from "@/domain/private-registry-image/schemas/private-registry-image.schema";
import type { GetPrivateRegistryImagesPayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 내 이미지 목록 조회
 */
export const useGetPrivateRegistryImages = (
  payload: GetPrivateRegistryImagesPayload,
): UseQueryResult<CoreListResponse<PrivateRegistryImageListType>, Error> => {
  const { privateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.list(payload),
    queryFn: async () => {
      const response = await privateRegistryImageService.getList(payload);
      return response.data;
    },
  });
};
