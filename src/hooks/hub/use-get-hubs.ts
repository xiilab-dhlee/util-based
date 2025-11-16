import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { hubKeys } from "@/constants/hub/hub.key";
import { useServices } from "@/providers/service-provider";
import type { HubListType } from "@/schemas/hub.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetHubsPayload } from "@/types/hub/hub.type";

/**
 * 허브 목록 조회
 */
export const useGetHubs = (
  payload: GetHubsPayload,
): UseQueryResult<CoreListResponse<HubListType>, Error> => {
  const { hubService } = useServices();

  return useQuery({
    queryKey: hubKeys.list(payload),
    queryFn: async () => {
      const response = await hubService.getList(payload);
      return response.data;
    },
  });
};
