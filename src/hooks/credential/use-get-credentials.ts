import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { credentialKeys } from "@/constants/credential/credential.key";
import { useServices } from "@/providers/service-provider";
import type { CredentialListType } from "@/schemas/credential.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetCredentialsPayload } from "@/types/credential/credential.type";

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
