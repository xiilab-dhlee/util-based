import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import credentialKeys from "@/constants/credential/credential.key";
import { useServices } from "@/providers/service-provider";
import type { GetCredentialsPayload } from "@/types/credential/credential.interface";
import type { Credential } from "@/types/credential/credential.model";

/**
 * 크레덴셜 목록 조회
 */
export const useGetCredentials = (
  payload: GetCredentialsPayload,
): UseQueryResult<{ credentials: Credential[]; total: number }, Error> => {
  const { credentialService } = useServices();

  return useQuery({
    queryKey: credentialKeys.list(payload),
    queryFn: async () => {
      const { credentials, total } = await credentialService.getList(payload);
      return { credentials, total };
    },
  });
};

