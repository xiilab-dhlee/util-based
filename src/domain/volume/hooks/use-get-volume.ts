import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { volumeKeys } from "@/domain/volume/constants/volume.key";
import type { VolumeDetailType } from "@/domain/volume/schemas/volume.schema";
import { useServices } from "@/shared/providers/service-provider";

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
