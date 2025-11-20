import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { nodeKeys } from "@/domain/node/constants/node.key";
import type { NodeListType } from "@/domain/node/schemas/node.schema";
import type { GetNodesPayload } from "@/domain/node/types/node.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 노드 목록 조회
 */
export const useGetNodes = (
  payload: GetNodesPayload,
): UseQueryResult<CoreListResponse<NodeListType>, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.list(payload),
    queryFn: async () => {
      const response = await nodeService.getList(payload);
      return response.data;
    },
  });
};
