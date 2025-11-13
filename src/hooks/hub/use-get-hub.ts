import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import hubKeys from "@/constants/hub/hub.key";
import { useServices } from "@/providers/service-provider";

/**
 * 허브 상세 조회
 */
export const useGetHub = (id: number): UseQueryResult<any, Error> => {
  const { hubService } = useServices();

  return useQuery({
    queryKey: hubKeys.detail(id),
    queryFn: async () => {
      const { data } = await hubService.getDetail(id);
      const { data: readme } = await hubService.getReadme(id);
      return { detail: data, readme };
    },
    enabled: id !== -1,
  });
};

