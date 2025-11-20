import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { NetworkAdapterInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 서버의 네트워크 어댑터 정보 조회
 */
export const useGetRedfishSystemNetworkAdapter = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<{ members: NetworkAdapterInfoType[] }, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.networkAdapterInfo(bmcIp, systemId),
    queryFn: async () => {
      const response = await redfishService.getSystemNetworkAdaptor(
        bmcIp,
        systemId,
      );
      return response.data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};
