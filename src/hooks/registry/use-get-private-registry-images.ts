import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import registryKeys from "@/constants/registry/registry.key";
import { useServices } from "@/providers/service-provider";
import type { GetPrivateRegistryImagesPayload } from "@/types/registry/registry.interface";
import type { RegistryImage } from "@/types/registry/registry.model";

/**
 * 내부 레지스트리 내 이미지 목록 조회
 */
export const useGetPrivateRegistryImages = (
  payload: GetPrivateRegistryImagesPayload,
): UseQueryResult<{ content: RegistryImage[]; total: number }, Error> => {
  const { privateRegistryService } = useServices();

  return useQuery({
    queryKey: registryKeys.privateRegistryimageList(payload),
    queryFn: async () => {
      const { content, total } =
        await privateRegistryService.getPrivateRegistryImageList(payload);
      return { content, total };
    },
    enabled: !!payload.registryName,
  });
};

