import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateVolumePayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 볼륨 수정
 */
export const useUpdateVolume = (): UseMutationResult<
  unknown,
  Error,
  UpdateVolumePayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateVolumePayload) => {
      return volumeService.updateVolume(payload);
    },
    onSuccess: () => {},
  });
};
