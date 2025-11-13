import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import nodeKeys from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";

/**
 * 노드 리소스 조회
 */
export const useGetNodeResources = (nodeName: string): UseQueryResult<any, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.resources(nodeName),
    queryFn: () => nodeService.getResources(nodeName),
    enabled: !!nodeName,
  });
};

