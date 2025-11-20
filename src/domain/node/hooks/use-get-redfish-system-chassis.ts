import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type {
  ChassisInfoType,
  PowerSupplyInfoType,
  ThermalInfoType,
} from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 서버의 새시 리소스 조회
 */
export const useGetRedfishSystemChassis = (
  bmcIp: string,
): UseQueryResult<
  {
    members: ChassisInfoType[];
    powerSupplies: PowerSupplyInfoType[];
    thermals: ThermalInfoType[];
  },
  Error
> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.chassisInfo(bmcIp),
    queryFn: async () => {
      const response = await redfishService.getSystemChassis(bmcIp);
      return response.data;
    },
    enabled: !isEmpty(bmcIp),
  });
};
