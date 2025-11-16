import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { nodeKeys } from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";
import type { NodeDetailType } from "@/schemas/node.schema";

/**
 * 노드 상세 조회
 */
export const useGetNode = (
  nodeName: string,
): UseQueryResult<NodeDetailType, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.detail(nodeName),
    queryFn: async () => {
      const response = await nodeService.getDetail(nodeName);
      return response.data;
    },
    enabled: !!nodeName,
  });
};
