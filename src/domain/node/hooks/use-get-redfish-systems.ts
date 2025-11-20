import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";

import { redfishKeys } from "@/domain/node/constants/redfish.key";
import type { SystemsInfoType } from "@/domain/node/schemas/redfish.schema";
import { useServices } from "@/shared/providers/service-provider";

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
