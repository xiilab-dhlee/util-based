import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UpdatePrivateRegistryImagePayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 수정
 */
export const useUpdatePrivateRegistryImage = (): UseMutationResult<
  unknown,
  Error,
  UpdatePrivateRegistryImagePayload,
  unknown
> => {
  const { privateRegistryImageService } = useServices();

  return useMutation({
    mutationFn: (payload) => privateRegistryImageService.updateImage(payload),

    onSuccess: () => {},
  });
};
