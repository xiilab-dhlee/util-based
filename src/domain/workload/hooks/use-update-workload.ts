import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UpdateWorkloadPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";

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
