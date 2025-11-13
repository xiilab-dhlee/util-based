import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

/**
 * 서버의 메모리 정보 조회
 */
export const useGetRedfishSystemMemory = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.memoryInfo(bmcIp, systemId),
    queryFn: async () => {
      const { data } = await redfishService.getSystemMemory(bmcIp, systemId);
      return data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};

