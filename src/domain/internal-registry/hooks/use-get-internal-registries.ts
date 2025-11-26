import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { internalregistryKeys } from "@/domain/internal-registry/constants/internal-registry.key";
import type { InternalRegistryListType } from "@/domain/internal-registry/schemas/internal-registry.schema";
import type { GetInternalRegistriesPayload } from "@/domain/internal-registry/types/internal-registry.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 내부 레지스트리 목록 조회
 */
export const useGetInternalRegistries = (
  payload: GetInternalRegistriesPayload,
): UseQueryResult<CoreListResponse<InternalRegistryListType>, Error> => {
  const { internalregistryService } = useServices();

  return useQuery({
    queryKey: internalregistryKeys.list(payload),
    queryFn: async () => {
      const response = await internalregistryService.getList(payload);
      return response.data;
    },
  });
};
