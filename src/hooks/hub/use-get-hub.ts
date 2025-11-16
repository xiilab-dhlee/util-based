import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { hubKeys } from "@/constants/hub/hub.key";
import { useServices } from "@/providers/service-provider";
import type { HubDetailType } from "@/schemas/hub.schema";

/**
 * 허브 상세 조회
 */
export const useGetHub = (id: number): UseQueryResult<HubDetailType, Error> => {
  const { hubService } = useServices();

  return useQuery({
    queryKey: hubKeys.detail(id),
    queryFn: async () => {
      const { data } = await hubService.getDetail(id);
      const { data: readme } = await hubService.getReadme(id);
      return { ...data, readme };
    },
    enabled: id !== -1,
  });
};
