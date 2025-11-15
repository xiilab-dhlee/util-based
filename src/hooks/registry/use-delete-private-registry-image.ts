import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { DeletePrivateRegistryImagePayload } from "@/types/private-registry/private-registry.type";

/**
 * 내부 레지스트리 내 이미지 삭제
 */
export const useDeletePrivateRegistryImage = (): UseMutationResult<
  any,
  Error,
  DeletePrivateRegistryImagePayload,
  unknown
> => {
  const { privateRegistryService } = useServices();

  return useMutation({
    mutationFn: (payload: DeletePrivateRegistryImagePayload): Promise<any> => {
      return privateRegistryService.deletePrivateRegistryImage(payload);
    },
    onSuccess: () => {},
  });
};
