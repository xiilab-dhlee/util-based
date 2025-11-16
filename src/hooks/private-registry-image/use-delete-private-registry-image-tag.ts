import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";

/**
 * 내부 레지스트리 이미지 태그 삭제
 */
export const useDeletePrivateRegistryImageTag = (): UseMutationResult<
  unknown,
  Error,
  number[],
  unknown
> => {
  const { privateRegistryImageService } = useServices();

  return useMutation({
    mutationFn: (tags: number[]) => {
      return privateRegistryImageService.deleteImageTag(tags);
    },
    onSuccess: () => {},
  });
};
