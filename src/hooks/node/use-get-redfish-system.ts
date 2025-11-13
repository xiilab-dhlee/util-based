import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

export const useGetRedfishSystem = (
  bmcIp: string,
  systemId: string,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.detail(bmcIp, systemId),
    queryFn: async () => {
      const { data } = await redfishService.getSystem(bmcIp, systemId);
      return data;
    },
    enabled: !isEmpty(bmcIp) && !isEmpty(systemId),
  });
};

