import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { ProcessorInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 서버의 디바이스 목록 조회
 */
export const useGetRedfishSystemDevice = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<{ members: ProcessorInfoType[] }, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.processorsInfo(bmcIp, systemId),
    queryFn: async () => {
      const response = await redfishService.getSystemProcessors(
        bmcIp,
        systemId,
      );
      return response.data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};
