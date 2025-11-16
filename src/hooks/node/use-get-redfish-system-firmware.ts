import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import { redfishKeys } from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";
import type { FirmwareInfoType } from "@/schemas/redfish.schema";

/**
 * 서버의 펌웨어 인벤토리 목록 조회
 */
export const useGetRedfishSystemFirmware = (
  bmcIp: string,
): UseQueryResult<{ members: FirmwareInfoType[] }, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.firmwareInfo(bmcIp),
    queryFn: async () => {
      const response = await redfishService.getSystemFirmware(bmcIp);
      return response.data;
    },
    enabled: !isEmpty(bmcIp),
  });
};
