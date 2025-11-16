import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import { redfishKeys } from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";
import type { MemoryInfoType } from "@/schemas/redfish.schema";

/**
 * 서버의 메모리 정보 조회
 */
export const useGetRedfishSystemMemory = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<MemoryInfoType, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.memoryInfo(bmcIp, systemId),
    queryFn: async () => {
      const response = await redfishService.getSystemMemory(bmcIp, systemId);
      return response.data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};
