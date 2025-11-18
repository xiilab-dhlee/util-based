import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateVolumeFolderPayload } from "@/types/volume/volume.type";

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
