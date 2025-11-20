import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { MemoryInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

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
