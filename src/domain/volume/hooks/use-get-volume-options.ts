import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";
import type { CoreDropdownOption } from "@/shared/types/core.model";
import { volumeKeys } from "../constants/volume.key";
import type { VolumeListType } from "../schemas/volume.schema";

/**
 * 볼륨 옵션 목록 조회
 *
 */
export const useGetVolumeOptions = (): UseQueryResult<
  CoreDropdownOption<VolumeListType>[],
  Error
> => {
  const { volumeService } = useServices();

  return useQuery({
    queryKey: volumeKeys.allList(),
    queryFn: async () => {
      const response = await volumeService.getList({
        page: 1,
        size: 100,
        searchText: "",
      });
      return response.data;
    },
    select: (data) =>
      data.content.map((volume: VolumeListType) => ({
        label: volume.name,
        value: volume.uid,
        origin: volume,
      })),
  });
};
