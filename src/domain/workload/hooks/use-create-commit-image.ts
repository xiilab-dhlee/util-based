import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CreateCommitImagePayload } from "@/domain/workload/types/workload.type";
import { useServices } from "@/shared/providers/service-provider";

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
