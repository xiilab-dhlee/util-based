import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageListType } from "@/domain/private-registry-image/schemas/private-registry-image.schema";
import type { GetAdminPrivateRegistryImagesPayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
