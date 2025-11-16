import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import registryKeys from "@/constants/registry/private-registry.key";
import { useServices } from "@/providers/service-provider";
import type { GetPrivateRegistryImageTagsPayload } from "@/types/private-registry/private-registry.type";
import type { RegistryImageTag } from "@/types/registry/registry.model";

/**
 * 내부 레지스트리 내 이미지 태그 목록 조회
 */
export const useGetPrivateRegistryImageTags = (
  payload: GetPrivateRegistryImageTagsPayload,
): UseQueryResult<{ content: RegistryImageTag[]; total: number }, Error> => {
  const { privateRegistryService } = useServices();

  return useQuery({
    queryKey: registryKeys.privateRegistryImageTags(payload),
    queryFn: async () => {
      const { content, total } =
        await privateRegistryService.getPrivateRegistryImageTags(payload);
      return { content, total };
    },
    enabled: !!payload.imageId,
  });
};
