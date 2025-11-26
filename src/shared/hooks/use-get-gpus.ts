import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";
import type { GpuListType } from "../schemas/gpu.schema";

/**
 * GPU 목록 조회
 */
export const useGetGpus = (): UseQueryResult<
  CoreListResponse<GpuListType>,
  Error
> => {
  const { gpuService } = useServices();

  return useQuery({
    queryKey: ["gpu", "list"],
    queryFn: async () => {
      const response = await gpuService.getList();
      return response.data;
    },
  });
};
