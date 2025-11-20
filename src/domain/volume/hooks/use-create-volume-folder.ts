import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateVolumeFolderPayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 볼륨 폴더 추가
 */
export const useCreateVolumeFolder = (): UseMutationResult<
  unknown,
  Error,
  CreateVolumeFolderPayload,
  unknown
> => {
  const { volumeService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateVolumeFolderPayload) => {
      return volumeService.createVolumeFolder(payload);
    },
    onSuccess: () => {},
  });
};
