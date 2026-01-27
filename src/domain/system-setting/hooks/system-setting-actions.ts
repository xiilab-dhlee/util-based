import { useQueryClient } from "@tanstack/react-query";

import {
  getGetPolicySetQueryKey,
  useUpdatePolicySet,
} from "@/api/generated/admin-workspace/admin-workspace";

export function useUpdatePolicySetAction(
  options?: Parameters<typeof useUpdatePolicySet>[0],
) {
  const queryClient = useQueryClient();

  return useUpdatePolicySet({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, context, client) => {
        // 정책 조회 API 무효화
        queryClient.invalidateQueries({
          queryKey: getGetPolicySetQueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, context, client);
      },
    },
  });
}
