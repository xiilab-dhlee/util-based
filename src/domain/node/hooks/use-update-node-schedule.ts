import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateNodeSchedulingPayload } from "@/domain/node/types/node.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 노드 스케쥴링 설정
 */
export const useUpdateNodeSchedule = (): UseMutationResult<
  unknown,
  Error,
  UpdateNodeSchedulingPayload,
  unknown
> => {
  const { nodeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateNodeSchedulingPayload) => {
      return nodeService.updateScheduling(payload);
    },
  });
};
