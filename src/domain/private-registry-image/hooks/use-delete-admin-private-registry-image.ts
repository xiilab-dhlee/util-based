import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DeleteAdminPrivateRegistryImagePayload } from "@/domain/private-registry-image/types/private-registry-image.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 관리자 내부 레지스트리 내 이미지 삭제
 */
export const useDeleteAdminPrivateRegistryImage = (): UseMutationResult<
  unknown,
  Error,
  DeleteAdminPrivateRegistryImagePayload,
  unknown
> => {
  const { adminPrivateRegistryImageService } = useServices();

  return useMutation({
    mutationFn: (payload: DeleteAdminPrivateRegistryImagePayload) => {
      return adminPrivateRegistryImageService.deleteImage(payload);
    },
    onSuccess: () => {},
  });
};
