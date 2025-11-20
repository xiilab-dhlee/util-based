import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { volumeKeys } from "@/domain/volume/constants/volume.key";
import type { GetVolumeFilesPayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreFileListResponse } from "@/shared/types/core.model";

/**
 * 볼륨 파일 목록 조회
 */
export const useGetVolumeFiles = (
  payload: GetVolumeFilesPayload,
): UseQueryResult<CoreFileListResponse, Error> => {
  const { volumeService } = useServices();

  return useQuery({
    queryKey: volumeKeys.fileList(payload),
    queryFn: async () => {
      const response = await volumeService.getFileList(payload);
      return response.data;
    },
  });
};
