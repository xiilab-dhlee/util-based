import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 내 이미지 삭제
 */
export const useDeleteInternalRegistryImage = (): UseMutationResult<
  unknown,
  Error,
  number[],
  unknown
> => {
  const { internalregistryImageService } = useServices();

  return useMutation({
    mutationFn: (images: number[]) => {
      return internalregistryImageService.deleteImage(images);
    },
    onSuccess: () => {},
  });
};
