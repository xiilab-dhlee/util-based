import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryKeys } from "@/domain/private-registry/constants/private-registry.key";
import type { PrivateRegistryListType } from "@/domain/private-registry/schemas/private-registry.schema";
import type { GetPrivateRegistriesPayload } from "@/domain/private-registry/types/private-registry.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
