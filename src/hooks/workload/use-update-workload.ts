import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateWorkloadPayload } from "@/types/workload/workload.type";

/**
 * 워크로드 수정
 */
export const useUpdateWorkload = (): UseMutationResult<
  unknown,
  Error,
  UpdateWorkloadPayload,
  unknown
> => {
  const { workloadService } = useServices();

  return useMutation({
    mutationFn: (payload) => workloadService.updateWorkload(payload),

    onSuccess: () => {},
  });
};
