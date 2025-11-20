import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateMpsPayload } from "@/domain/node/types/node.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * MPS 설정 수정
 */
export const useUpdateMps = (): UseMutationResult<
  unknown,
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
