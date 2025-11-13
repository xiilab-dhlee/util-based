import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import volumeKeys from "@/constants/volume/volume.key";
import { useServices } from "@/providers/service-provider";

/**
 * 볼륨 상세 조회
 */
export const useGetVolume = (id: string): UseQueryResult<any, Error> => {
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

