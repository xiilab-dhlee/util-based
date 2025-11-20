import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { credentialKeys } from "@/domain/credential/constants/credential.key";
import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import type { GetCredentialsPayload } from "@/domain/credential/types/credential.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 크레덴셜 목록 조회
 */
export const useGetCredentials = (
  payload: GetCredentialsPayload,
): UseQueryResult<CoreListResponse<CredentialListType>, Error> => {
  const { credentialService } = useServices();

  return useQuery({
    queryKey: credentialKeys.list(payload),
    queryFn: async () => {
      const response = await credentialService.getList(payload);
      return response.data;
    },
  });
};
