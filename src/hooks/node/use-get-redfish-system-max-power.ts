import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";
import type { PowerSupplyInfoType } from "@/schemas/redfish.schema";

/**
 * 서버 최대 전력 정보 조회
 */
export const useGetRedfishSystemMaxPower = (
  bmcIp: string,
  systemId: string,
  isActive: boolean,
): UseQueryResult<{ powerControl: PowerSupplyInfoType[] }, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.maxPowerInfo(bmcIp, systemId),
    queryFn: async () => {
      const { data } = await redfishService.getSystemMaxPower(bmcIp, systemId);
      return data;
    },
    enabled: !isEmpty(systemId) && isActive,
  });
};
