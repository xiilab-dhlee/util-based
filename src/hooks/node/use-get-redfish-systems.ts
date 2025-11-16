import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import { redfishKeys } from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";
import type { SystemsInfoType } from "@/schemas/redfish.schema";

/**
 * 서버 목록 조회
 */
export const useGetRedfishSystems = (
  bmcIp: string,
): UseQueryResult<SystemsInfoType, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.list(bmcIp),
    queryFn: async () => {
      const response = await redfishService.getSystems(bmcIp);
      return response.data;
    },
    enabled: !isEmpty(bmcIp),
  });
};
