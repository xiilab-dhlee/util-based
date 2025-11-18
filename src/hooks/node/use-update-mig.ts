import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateMigPayload } from "@/types/node/node.type";

/**
 * MIG 설정 수정
 */
export const useUpdateMig = (): UseMutationResult<
  unknown,
  Error,
  UpdateMigPayload,
  unknown
> => {
  const { nodeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateMigPayload) => {
      return nodeService.updateMig(payload);
    },
  });
};
