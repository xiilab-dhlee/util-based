import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { groupKeys } from "@/domain/group/constants/group.key";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreFileListResponse } from "@/shared/types/core.model";

/**
 * 그룹 전체 목록 조회
 */
export const useGetAllGroups = (): UseQueryResult<
  CoreFileListResponse,
  Error
> => {
  const { groupService } = useServices();

  return useQuery({
    queryKey: groupKeys.allList(),
    queryFn: async () => {
      const response = await groupService.getAll();
      return response.data;
    },
  });
};
