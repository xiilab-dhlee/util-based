import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateVolumePayload } from "@/types/volume/volume.type";

/**
 * 볼륨 수정
 */
export const useUpdateVolume = (): UseMutationResult<
  any,
  Error,
  UpdateVolumePayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateVolumePayload): Promise<any> => {
      return volumeService.updateVolume(payload);
    },
    onSuccess: () => {},
  });
};

