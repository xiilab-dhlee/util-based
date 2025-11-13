import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateCredentialPayload } from "@/types/credential/credential.interface";

/**
 * 크레덴셜 생성
 */
export const useCreateCredential = (): UseMutationResult<
  any,
  Error,
  CreateCredentialPayload,
  unknown
> => {
  const { credentialService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateCredentialPayload): Promise<any> => {
      return credentialService.createCredential(payload);
    },
    onSuccess: () => {},
  });
};

