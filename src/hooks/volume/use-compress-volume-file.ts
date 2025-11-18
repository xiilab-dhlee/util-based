import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CompressVolumeFilePayload } from "@/types/volume/volume.type";

/**
 * 볼륨 파일 압축
 */
export const useCompressVolumeFile = (): UseMutationResult<
  unknown,
  Error,
  CompressVolumeFilePayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: CompressVolumeFilePayload) => {
      return volumeService.compressVolumeFile(payload);
    },
    onSuccess: () => {},
  });
};
