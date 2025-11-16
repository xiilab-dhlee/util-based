import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { nodeKeys } from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";
import type { NodeResourcesType } from "@/schemas/node.schema";

/**
 * 노드 리소스 조회
 */
export const useGetNodeResources = (
  nodeName: string,
): UseQueryResult<NodeResourcesType, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.resources(nodeName),
    queryFn: async () => {
      const response = await nodeService.getResources(nodeName);
      return response.data;
    },
    enabled: !!nodeName,
  });
};
