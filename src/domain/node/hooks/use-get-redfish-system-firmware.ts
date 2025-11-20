import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { FirmwareInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

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
