import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { hubKeys } from "@/domain/hub/constants/hub.key";
import type { HubDetailType } from "@/domain/hub/schemas/hub.schema";
import { useServices } from "@/shared/providers/service-provider";

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
