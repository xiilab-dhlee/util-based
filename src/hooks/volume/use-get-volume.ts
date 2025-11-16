import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { volumeKeys } from "@/constants/volume/volume.key";
import { useServices } from "@/providers/service-provider";
import type { VolumeDetailType } from "@/schemas/volume.schema";

/**
 * 볼륨 상세 조회
 */
export const useGetVolume = (
  id: string,
): UseQueryResult<VolumeDetailType, Error> => {
  const { volumeService } = useServices();

  return useQuery({
    queryKey: volumeKeys.detail(id),
    queryFn: async () => {
      const response = await volumeService.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};
