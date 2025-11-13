import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

/**
 * 서버 목록 조회
 */
export const useGetRedfishSystems = (bmcIp: string): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.list(bmcIp),
    queryFn: async () => {
      const { data } = await redfishService.getSystems(bmcIp);
      return data;
    },
    enabled: !isEmpty(bmcIp),
  });
};

