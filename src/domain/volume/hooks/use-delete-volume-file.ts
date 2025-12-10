import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DeleteVolumeFilePayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 볼륨 파일 삭제
 */
export const useDeleteVolumeFile = (): UseMutationResult<
  unknown,
  Error,
  DeleteVolumeFilePayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: DeleteVolumeFilePayload) => {
      return volumeService.deleteVolumeFile(payload);
    },
    onSuccess: () => {},
  });
};
