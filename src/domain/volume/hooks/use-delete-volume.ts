import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { VolumeIdType } from "@/domain/volume/schemas/volume.schema";
import { useServices } from "@/shared/providers/service-provider";

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
