import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UpdateInternalRegistryImagePayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 수정
 */
export const useUpdateInternalRegistryImage = (): UseMutationResult<
  unknown,
  Error,
  UpdateInternalRegistryImagePayload,
  unknown
> => {
  const { internalregistryImageService } = useServices();

  return useMutation({
    mutationFn: (payload) => internalregistryImageService.updateImage(payload),

    onSuccess: () => {},
  });
};
