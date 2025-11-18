import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { groupKeys } from "@/constants/group/group.key";
import { useServices } from "@/providers/service-provider";
import type { GroupListType } from "@/schemas/group.schema";
import type { CoreListResponse } from "@/types/common/core.model";

/**
 * 그룹 전체 목록 조회
 */
export const useGetAllGroups = (): UseQueryResult<
  CoreListResponse<GroupListType>,
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
