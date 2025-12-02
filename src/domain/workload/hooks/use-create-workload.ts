import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CreateWorkloadPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크로드 생성
 */
export const useCreateWorkload = (): UseMutationResult<
  unknown,
  Error,
  CreateWorkloadPayload,
  unknown
> => {
  const { workloadService } = useServices();

  return useMutation({
    mutationFn: (payload) => workloadService.createWorkload(payload),

    onSuccess: () => {},
  });
};
