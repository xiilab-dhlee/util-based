import { useQueryClient } from "@tanstack/react-query";

import {
  getGetAdminResourceRequestsQueryKey,
  useApproveResourceRequest,
  useRejectResourceRequest,
} from "@/api/generated/admin-workspace/admin-workspace";

export function useApproveResourceRequestAction(
  options?: Parameters<typeof useApproveResourceRequest>[0],
) {
  const queryClient = useQueryClient();

  return useApproveResourceRequest({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, context, client) => {
        queryClient.invalidateQueries({
          queryKey: getGetAdminResourceRequestsQueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, context, client);
      },
    },
  });
}

export function useRejectResourceRequestAction(
  options?: Parameters<typeof useRejectResourceRequest>[0],
) {
  const queryClient = useQueryClient();

  return useRejectResourceRequest({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, context, client) => {
        queryClient.invalidateQueries({
          queryKey: getGetAdminResourceRequestsQueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, context, client);
      },
    },
  });
}
