import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageDetailType } from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import type { GetAdminInternalRegistryImagePayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 관리자 내부 레지스트리의 이미지 상세 조회
 */
export const useGetAdminInternalRegistryImage = (
  payload: GetAdminInternalRegistryImagePayload,
): UseQueryResult<InternalRegistryImageDetailType, Error> => {
  const { adminInternalRegistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.adminDetail(payload),
    queryFn: async () => {
      const response =
        await adminInternalRegistryImageService.getDetail(payload);
      return response.data;
    },
    enabled: !!payload.registryName && !!payload.imageId,
  });
};
