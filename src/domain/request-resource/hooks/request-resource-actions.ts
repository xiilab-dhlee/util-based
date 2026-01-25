import { useQueryClient } from "@tanstack/react-query";

import {
  getGetResourceRequests1QueryKey,
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
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: getGetResourceRequests1QueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, context);
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
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: getGetResourceRequests1QueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, context);
      },
    },
  });
}
