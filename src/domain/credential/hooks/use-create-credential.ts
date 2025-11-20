import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateCredentialPayload } from "@/domain/credential/types/credential.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 크레덴셜 생성
 */
export const useCreateCredential = (): UseMutationResult<
  unknown,
  Error,
  CreateCredentialPayload,
  unknown
> => {
  const { credentialService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateCredentialPayload) => {
      return credentialService.createCredential(payload);
    },
    onSuccess: () => {},
  });
};
