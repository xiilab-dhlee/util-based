import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import volumeKeys from "@/constants/volume/volume.key";
import { useServices } from "@/providers/service-provider";
import type { GetVolumesPayload } from "@/types/volume/volume.type";

/**
 * 볼륨 목록 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
 */
export const useGetVolumes = (
  payload: GetVolumesPayload,
): UseQueryResult<any, Error> => {
  const { volumeService } = useServices();

  return useQuery({
    queryKey: volumeKeys.list(payload),
    queryFn: async () => {
      const response = await volumeService.getList(payload);
      return response.data;
    },
  });
};

