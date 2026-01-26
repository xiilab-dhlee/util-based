import { useQueryClient } from "@tanstack/react-query";

import {
  getGetProfileQueryKey,
  useUpdateProfile,
} from "@/api/generated/account-profile/account-profile";

export function useUpdateProfileAction(
  options?: Parameters<typeof useUpdateProfile>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateProfile({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        const [, variables] = args;

        queryClient.invalidateQueries({
          queryKey: getGetProfileQueryKey(variables.accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}
