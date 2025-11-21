import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageDetailType } from "@/domain/private-registry-image/schemas/private-registry-image.schema";
import type { GetAdminPrivateRegistryImagePayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 관리자 내부 레지스트리의 이미지 상세 조회
 */
export const useGetAdminPrivateRegistryImage = (
  payload: GetAdminPrivateRegistryImagePayload,
): UseQueryResult<PrivateRegistryImageDetailType, Error> => {
  const { adminPrivateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.adminDetail(payload),
    queryFn: async () => {
      const response =
        await adminPrivateRegistryImageService.getDetail(payload);
      return response.data;
    },
    enabled: !!payload.registryName && !!payload.imageId,
  });
};
