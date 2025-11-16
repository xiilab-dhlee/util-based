import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { nodeKeys } from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";
import type { MpsInfoType } from "@/schemas/mps.schema";

/**
 * 노드 MPS 설정 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
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
