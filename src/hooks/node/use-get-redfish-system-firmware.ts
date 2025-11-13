import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

import redfishKeys from "@/constants/node/redfish.key";
import { useServices } from "@/providers/service-provider";

/**
 * 서버의 펌웨어 인벤토리 목록 조회
 */
export const useGetRedfishSystemFirmware = (
  bmcIp: string,
): UseQueryResult<any, Error> => {
  const { redfishService } = useServices();

  return useQuery({
    queryKey: redfishKeys.firmwareInfo(bmcIp),
    queryFn: async () => {
      const { data } = await redfishService.getSystemFirmware(bmcIp);
      return data;
    },
    enabled: !isEmpty(bmcIp),
  });
};

