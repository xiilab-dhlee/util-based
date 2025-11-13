import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import registryKeys from "@/constants/registry/registry.key";
import { useServices } from "@/providers/service-provider";
import type { GetPrivateRegistryImagePayload } from "@/types/registry/registry.interface";

/**
 * 내부 레지스트리 내 이미지 상세 조회
 */
export const useGetPrivateRegistryImage = (
  payload: GetPrivateRegistryImagePayload,
): UseQueryResult<{ image: any }, Error> => {
  const { privateRegistryService } = useServices();

  return useQuery({
    queryKey: registryKeys.privateRegistryImageDetail(payload),
    queryFn: async () => {
      const { image } =
        await privateRegistryService.getPrivateRegistryImageDetail(payload);

      return { image };
    },
    enabled: !!payload.registryName && !!payload.imageId,
  });
};

