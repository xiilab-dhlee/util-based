import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

/**
 * 서버의 새시 리소스 조회
 */
export const useGetRedfishSystemChassis = (
  bmcIp: string,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.chassisInfo(bmcIp),
    queryFn: async () => {
      const { data } = await redfishService.getSystemChassis(bmcIp);
      return data;
    },
    enabled: !isEmpty(bmcIp),
  });
};

