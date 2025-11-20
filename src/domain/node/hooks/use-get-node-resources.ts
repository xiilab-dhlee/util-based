import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { nodeKeys } from "@/domain/node/constants/node.key";
import type { NodeResourcesType } from "@/domain/node/schemas/node.schema";
import { useServices } from "@/shared/providers/service-provider";

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
