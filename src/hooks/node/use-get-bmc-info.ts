import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import nodeKeys from "@/constants/node/node.key";
import { useServices } from "@/providers/service-provider";

/**
 * 노드 BMC 정보 조회
 */
export const useGetNodeBmcInfo = (nodeIp: string): UseQueryResult<any, Error> => {
  const { redfishBmcService, redfishService } = useServices();

  return useQuery({
    queryKey: nodeKeys.bmcInfo(nodeIp),
    queryFn: async () => {
      const response = await redfishBmcService.getBmc(nodeIp);
      // BMC 정보가 있으면 연결
      if (response?.bmcUserName && response?.bmcPassword) {
        redfishService.connect(response?.bmcUserName, response?.bmcPassword);
      }

      return response;
    },
  });
};

