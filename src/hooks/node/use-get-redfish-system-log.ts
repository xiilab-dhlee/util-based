import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

const DEFAULT_PAGE_SIZE = 10;

/**
 * 서버의 로그 조회
 */
export const useGetRedfishSystemLog = (
  bmcIp: string,
  systemId: string,
  page: number,
  size: number = DEFAULT_PAGE_SIZE,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.logInfo(bmcIp, systemId, page, size),
    queryFn: async () => {
      const { data } = await redfishService.getSystemLogs(
        bmcIp,
        systemId,
        page,
        size,
      );
      return data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};

