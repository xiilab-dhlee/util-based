import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageListType } from "@/schemas/private-registry-image.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetAdminPrivateRegistryImagesPayload } from "@/types/private-registry-image/private-registry-image.type";

/**
 * 관리자 내부 레지스트리의 이미지 목록 조회
 */
export const useGetAdminPrivateRegistryImages = (
  payload: GetAdminPrivateRegistryImagesPayload,
): UseQueryResult<CoreListResponse<PrivateRegistryImageListType>, Error> => {
  const { adminPrivateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.adminList(payload),
    queryFn: async () => {
      const response = await adminPrivateRegistryImageService.getList(payload);
      return response.data;
    },
    enabled: !!payload.registryName,
  });
};
