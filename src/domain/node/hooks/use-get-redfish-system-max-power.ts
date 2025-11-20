import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { PowerSupplyInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

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
