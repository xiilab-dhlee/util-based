import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { VolumeListType } from "@/schemas/volume.schema";

/**
 * 볼륨 삭제
 */
export const useDeleteVolume = (): UseMutationResult<
  any,
  Error,
  Pick<VolumeListType, "uid">[],
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (volumes: Pick<VolumeListType, "uid">[]): Promise<any> => {
      return volumeService.deleteVolume(volumes);
    },
    onSuccess: () => {},
  });
};

