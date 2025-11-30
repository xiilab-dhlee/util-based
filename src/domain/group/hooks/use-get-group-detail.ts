import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { groupKeys } from "@/domain/group/constants/group.key";
import { useServices } from "@/shared/providers/service-provider";
import type { GroupDetailResponseType } from "@/shared/schemas/group-tree.schema";

/**
 * 그룹 상세 정보 조회
 *
 * 그룹을 하나씩 호출할 때마다 그룹 및 그룹 내 사용자 정보를 가져옵니다.
 */
export const useGetGroupDetail = (
  groupId: string,
): UseQueryResult<GroupDetailResponseType, Error> => {
  const { groupService } = useServices();

  return useQuery({
    queryKey: groupId ? groupKeys.detail(groupId) : [],
    enabled: Boolean(groupId),
    queryFn: async () => {
      const response = await groupService.getDetail(groupId);

      return response.data;
    },
  });
};
