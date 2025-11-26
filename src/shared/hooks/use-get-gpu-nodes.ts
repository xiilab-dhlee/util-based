import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";
import type { GpuNodeListType } from "../schemas/gpu.schema";

/**
 * GPU 노드 목록 조회
 */
export const useGetGpuNodes = (): UseQueryResult<
  CoreListResponse<GpuNodeListType>,
  Error
> => {
  const { gpuService } = useServices();

  return useQuery({
    queryKey: ["gpu", "node", "list"],
    queryFn: async () => {
      const response = await gpuService.getNodeList();
      return response.data;
    },
  });
};
