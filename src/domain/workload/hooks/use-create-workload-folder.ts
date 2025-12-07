import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateWorkloadFolderPayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크로드 폴더 추가
 */
export const useCreateWorkloadFolder = (): UseMutationResult<
  unknown,
  Error,
  CreateWorkloadFolderPayload,
  unknown
> => {
  const { workloadService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateWorkloadFolderPayload) => {
      return workloadService.createWorkloadFolder(payload);
    },
    onSuccess: () => {},
  });
};
