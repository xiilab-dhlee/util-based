import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateVolumePayload } from "@/types/volume/volume.type";

/**
 * 볼륨 생성
 */
export const useCreateVolume = (): UseMutationResult<
  any,
  Error,
  CreateVolumePayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateVolumePayload): Promise<any> => {
      return volumeService.createVolume(payload);
    },
    onSuccess: () => {},
  });
};

