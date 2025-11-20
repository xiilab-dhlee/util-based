import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { hubKeys } from "@/domain/hub/constants/hub.key";
import type { HubListType } from "@/domain/hub/schemas/hub.schema";
import type { GetHubsPayload } from "@/domain/hub/types/hub.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
