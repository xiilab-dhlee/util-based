import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { volumeKeys } from "@/domain/volume/constants/volume.key";
import type { VolumeListType } from "@/domain/volume/schemas/volume.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreDropdownOption } from "@/shared/types/core.model";

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
