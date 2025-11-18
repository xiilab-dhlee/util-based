import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { VolumeIdType } from "@/schemas/volume.schema";

/**
 * 볼륨 삭제
 */
export const useDeleteVolume = (): UseMutationResult<
  unknown,
  Error,
  VolumeIdType[],
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (volumes: VolumeIdType[]) => {
      return volumeService.deleteVolume(volumes);
    },
    onSuccess: () => {},
  });
};
