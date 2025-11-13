import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import registryKeys from "@/constants/registry/registry.key";
import { useServices } from "@/providers/service-provider";
import type { GetPrivateRegistriesPayload } from "@/types/registry/registry.interface";
import type { Registry } from "@/types/registry/registry.model";

/**
 * 내부 레지스트리 목록 조회
 */
export const useGetPrivateRegistries = (
  payload: GetPrivateRegistriesPayload,
): UseQueryResult<{ content: Registry[]; total: number }, Error> => {
  const { privateRegistryService } = useServices();

  return useQuery({
    queryKey: registryKeys.privateRegistryList(payload),
    queryFn: async () => {
      const { content, total } =
        await privateRegistryService.getPrivateRegistryList(payload);
      return { content, total };
    },
  });
};

