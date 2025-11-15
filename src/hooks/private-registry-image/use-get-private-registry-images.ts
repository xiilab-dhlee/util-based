import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageListType } from "@/schemas/private-registry-image.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetPrivateRegistryImagesPayload } from "@/types/private-registry-image/private-registry-image.type";

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
