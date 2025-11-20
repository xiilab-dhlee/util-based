import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { volumeKeys } from "@/domain/volume/constants/volume.key";
import type { VolumeListType } from "@/domain/volume/schemas/volume.schema";
import type { GetVolumesPayload } from "@/domain/volume/types/volume.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
