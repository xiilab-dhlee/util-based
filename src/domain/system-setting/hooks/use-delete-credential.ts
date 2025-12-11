import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { credentialKeys } from "@/domain/credential/constants/credential.key";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 크레덴셜 삭제 훅
 */
export const useDeleteCredential = (): UseMutationResult<
  void,
  Error,
  number
> => {
  const { credentialService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await credentialService.deleteCredential(id);
    },
    onSuccess: () => {
      // 모든 크레덴셜 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: credentialKeys.default,
      });
    },
  });
};
