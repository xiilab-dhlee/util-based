import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import nodeKeys from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";

/**
 * 노드 상세 조회
 */
export const useGetNode = (nodeName: string): UseQueryResult<any, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.detail(nodeName),
    queryFn: () => nodeService.getDetail(nodeName),
    enabled: !!nodeName,
  });
};

