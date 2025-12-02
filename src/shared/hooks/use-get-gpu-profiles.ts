import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";
import type { GpuProfileListType } from "@/shared/schemas/gpu.schema";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * GPU 프로파일 목록 조회
 */
export const useGetGpuProfiles = (): UseQueryResult<
  CoreListResponse<GpuProfileListType>,
  Error
> => {
  const { gpuService } = useServices();

  return useQuery({
    queryKey: ["gpu", "profile", "list"],
    queryFn: async () => {
      const response = await gpuService.getProfileList();
      return response.data;
    },
  });
};
