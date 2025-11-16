import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import { redfishKeys } from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";
import type {
  ChassisInfoType,
  PowerSupplyInfoType,
  ThermalInfoType,
} from "@/schemas/redfish.schema";

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
