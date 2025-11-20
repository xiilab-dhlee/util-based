import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { MpsInfoType } from "@/domain/monitoring/schemas/mps.schema";
import { nodeKeys } from "@/domain/node/constants/node.key";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 노드 MPS 설정 조회
 *
 */
export const useGetNodeMpsInfo = (
  nodeName: string,
): UseQueryResult<MpsInfoType, Error> => {
  const { nodeService } = useServices();

  return useQuery({
    queryKey: nodeKeys.mpsInfo(nodeName),
    queryFn: async () => {
      const response = await nodeService.getMpsInfo(nodeName);
      return response.data;
    },
    enabled: !!nodeName,
  });
};
