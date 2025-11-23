import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DeleteAdminInternalRegistryImagePayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 관리자 내부 레지스트리 내 이미지 삭제
 */
export const useDeleteAdminInternalRegistryImage = (): UseMutationResult<
  unknown,
  Error,
  DeleteAdminInternalRegistryImagePayload,
  unknown
> => {
  const { adminInternalRegistryImageService } = useServices();

  return useMutation({
    mutationFn: (payload: DeleteAdminInternalRegistryImagePayload) => {
      return adminInternalRegistryImageService.deleteImage(payload);
    },
    onSuccess: () => {},
  });
};
