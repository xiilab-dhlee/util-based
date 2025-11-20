import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CompressVolumeFilePayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";

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
