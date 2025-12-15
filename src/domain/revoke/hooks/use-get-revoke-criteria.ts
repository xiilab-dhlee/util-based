import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { revokeHistoryKeys } from "@/domain/revoke/constants/revoke-history.key";
import type { RevokeCriteriaItemType } from "@/domain/revoke/schemas/revoke-history.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 회수 기준 조회 훅
 *
 * @returns React Query 결과
 */
export const useGetRevokeCriteria = (): UseQueryResult<
  RevokeCriteriaItemType[],
  Error
> => {
  const { revokeHistoryService } = useServices();

  return useQuery<RevokeCriteriaItemType[], Error>({
    queryKey: revokeHistoryKeys.criteria(),
    queryFn: async () => {
      const response = await revokeHistoryService.getCriteria();
      return response.data.content;
    },
  });
};
