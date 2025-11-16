import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryKeys } from "@/constants/private-registry/private-registry.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryListType } from "@/schemas/private-registry.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetPrivateRegistriesPayload } from "@/types/private-registry/private-registry.type";

/**
 * 내부 레지스트리 목록 조회
 */
export const useGetPrivateRegistries = (
  payload: GetPrivateRegistriesPayload,
): UseQueryResult<CoreListResponse<PrivateRegistryListType>, Error> => {
  const { privateRegistryService } = useServices();

  return useQuery({
    queryKey: privateRegistryKeys.list(payload),
    queryFn: async () => {
      const response = await privateRegistryService.getList(payload);
      return response.data;
    },
  });
};
