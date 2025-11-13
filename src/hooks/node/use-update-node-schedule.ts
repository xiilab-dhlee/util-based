import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateNodeSchedulingPayload } from "@/types/node/node.interface";

/**
 * 노드 스케쥴링 설정
 */
export const useUpdateNodeSchedule = (): UseMutationResult<
  any,
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

