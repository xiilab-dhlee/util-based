import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { CreateCredentialPayload } from "@/domain/credential/types/credential.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 크리덴셜 생성
 */
export const useCreateCredential = (): UseMutationResult<
  unknown,
  Error,
  CreateCredentialPayload,
  unknown
> => {
  const queryClient = useQueryClient();
  const { credentialService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateCredentialPayload) => {
      return credentialService.createCredential(payload);
    },
    onSuccess: () => {
      // credential이 포함된 모든 쿼리 캐시 제거
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === "string" && key.includes("credential"),
          ),
      });
    },
  });
};
