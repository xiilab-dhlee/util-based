import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateMigPayload } from "@/domain/node/types/node.type";
import { useServices } from "@/shared/providers/service-provider";

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
