import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { WorkloadIdType } from "@/domain/workload/schemas/workload.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크로드 삭제
 */
export const useDeleteWorkload = (): UseMutationResult<
  unknown,
  Error,
  WorkloadIdType,
  unknown
> => {
  const { workloadService } = useServices();

  return useMutation({
    mutationFn: (workloadId: WorkloadIdType) => {
      return workloadService.deleteWorkload({ workloadId });
    },
    onSuccess: () => {},
  });
};
