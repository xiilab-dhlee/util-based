import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import { redfishKeys } from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";
import type { ProcessorInfoType } from "@/schemas/redfish.schema";

/**
 * 서버의 프로세서 목록 조회
 */
export const useGetRedfishSystemProcessors = (
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
