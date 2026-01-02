import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { credentialKeys } from "@/domain/credential/constants/credential.key";
import type { CredentialDetailType } from "@/domain/credential/schemas/credential.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 크리덴셜 상세 조회 훅
 * @param id 크리덴셜 ID
 */
export const useGetCredentialDetail = (
  id: number | null,
): UseQueryResult<CredentialDetailType, Error> => {
  const { credentialService } = useServices();

  return useQuery({
    queryKey: credentialKeys.detail(id),
    queryFn: async () => {
      const response = await credentialService.getDetail(id as number);
      return response.data;
    },
    enabled: !isNil(id),
  });
};
