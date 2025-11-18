import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { volumeKeys } from "@/constants/volume/volume.key";
import { useServices } from "@/providers/service-provider";
import type { VolumeListType } from "@/schemas/volume.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetVolumesPayload } from "@/types/volume/volume.type";

/**
 * 볼륨 목록 조회
 *
 */
export const useGetVolumes = (
  payload: GetVolumesPayload,
): UseQueryResult<CoreListResponse<VolumeListType>, Error> => {
  const { volumeService } = useServices();

  return useQuery({
    queryKey: volumeKeys.list(payload),
    queryFn: async () => {
      const response = await volumeService.getList(payload);
      return response.data;
    },
  });
};
