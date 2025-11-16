import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { DeleteAdminPrivateRegistryImagePayload } from "@/types/private-registry-image/private-registry-image.type";

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
