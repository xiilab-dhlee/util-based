import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

/**
 * 서버의 네트워크 어댑터 정보 조회
 */
export const useGetRedfishSystemNetworkAdapter = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.networkAdapterInfo(bmcIp, systemId),
    queryFn: async () => {
      const { data } = await redfishService.getSystemNetworkAdaptor(
        bmcIp,
        systemId,
      );
      return data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};

