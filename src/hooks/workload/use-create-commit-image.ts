import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateCommitImagePayload } from "@/types/workload/workload.type";

/**
 * 워크로드 커밋 이미지 생성
 */
export const useCreateCommitImage = (): UseMutationResult<
  unknown,
  Error,
  CreateCommitImagePayload,
  unknown
> => {
  const { workloadService } = useServices();

  return useMutation({
    mutationFn: (payload) => workloadService.createCommitImage(payload),
    onSuccess: () => {},
  });
};
