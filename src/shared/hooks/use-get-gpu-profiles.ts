import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";
import type { GpuProfileListType } from "../schemas/gpu.schema";

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
