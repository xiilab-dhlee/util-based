import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { DropdownOption } from "xiilab-ui";

import { hubKeys } from "@/domain/hub/constants/hub.key";
import type { HubListType } from "@/domain/hub/schemas/hub.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 허브 옵션 목록 조회
 */
export const useGetHubOptions = (): UseQueryResult<DropdownOption[], Error> => {
  const { hubService } = useServices();

  return useQuery({
    queryKey: hubKeys.allList(),
    queryFn: async () => {
      const response = await hubService.getList({
        page: 1,
        size: 100,
        searchText: "",
      });
      return response.data;
    },
    select: (data) =>
      data.content.map((hub: HubListType) => ({
        label: hub.title,
        value: hub.id,
      })),
  });
};
