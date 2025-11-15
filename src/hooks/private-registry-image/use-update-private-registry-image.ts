import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdatePrivateRegistryImagePayload } from "@/types/private-registry-image/private-registry-image.type";

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
    mutationFn: (payload) =>
      privateRegistryImageService.updatePrivateRegistryImage(payload),

    onSuccess: () => {},
  });
};
