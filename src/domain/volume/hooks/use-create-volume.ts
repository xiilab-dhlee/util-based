import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateVolumePayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 볼륨 생성
 */
export const useCreateVolume = (): UseMutationResult<
  unknown,
  Error,
  CreateVolumePayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateVolumePayload) => {
      return volumeService.createVolume(payload);
    },
    onSuccess: () => {},
  });
};
