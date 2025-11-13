import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

/**
 * 서버의 디바이스 목록 조회
 */
export const useGetRedfishSystemDevice = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.processorsInfo(bmcIp, systemId),
    queryFn: async () => {
      const { data } = await redfishService.getSystemProcessors(
        bmcIp,
        systemId,
      );
      return data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};

