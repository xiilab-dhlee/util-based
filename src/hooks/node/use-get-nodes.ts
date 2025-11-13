import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import nodeKeys from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";
import type { GetNodesPayload } from "@/types/node/node.interface";

/**
 * 노드 목록 조회
 */
export const useGetNodes = (payload: GetNodesPayload): UseQueryResult<any, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.list(payload),
    queryFn: async () => {
      const response = await nodeService.getList(payload);
      return response.data;
    },
  });
};

