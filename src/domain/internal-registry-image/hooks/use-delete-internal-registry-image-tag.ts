import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 태그 삭제
 */
export const useDeleteInternalRegistryImageTag = (): UseMutationResult<
  unknown,
  Error,
  number[],
  unknown
> => {
  const { internalregistryImageService } = useServices();

  return useMutation({
    mutationFn: (tags: number[]) => {
      return internalregistryImageService.deleteImageTag(tags);
    },
    onSuccess: () => {},
  });
};
