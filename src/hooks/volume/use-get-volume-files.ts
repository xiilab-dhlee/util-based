import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import volumeKeys from "@/constants/volume/volume.key";
import { useServices } from "@/providers/service-provider";
import type { GetVolumeFilesPayload } from "@/types/volume/volume.type";

/**
 * 볼륨 파일 목록 조회
 */
export const useGetVolumeFiles = (
  payload: GetVolumeFilesPayload,
): UseQueryResult<any, Error> => {
  const { volumeService } = useServices();

  return useQuery({
    queryKey: volumeKeys.fileList(payload),
    queryFn: async () => {
      const response = await volumeService.getFileList(payload);
      return response.data;
    },
  });
};

