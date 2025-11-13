import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateMpsPayload } from "@/types/node/node.interface";

/**
 * MPS 설정 수정
 */
export const useUpdateMps = (): UseMutationResult<
  any,
  Error,
  UpdateMpsPayload,
  unknown
> => {
  const { nodeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateMpsPayload) => {
      return nodeService.updateMps(payload);
    },
  });
};

