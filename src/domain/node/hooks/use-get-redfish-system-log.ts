import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { LogInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

const DEFAULT_PAGE_SIZE = 10;

/**
 * 서버의 로그 조회
 */
export const useGetRedfishSystemLog = (
  bmcIp: string,
  systemId: string,
  page: number,
  size: number = DEFAULT_PAGE_SIZE,
): UseQueryResult<{ logs: { Members: LogInfoType[] } }, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.logInfo(bmcIp, systemId, page, size),
    queryFn: async () => {
      const response = await redfishService.getSystemLogs(
        bmcIp,
        systemId,
        page,
        size,
      );
      return response.data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};
