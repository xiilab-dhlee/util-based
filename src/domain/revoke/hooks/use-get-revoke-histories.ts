import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { revokeHistoryKeys } from "@/domain/revoke/constants/revoke-history.key";
import type { RevokeHistoryItemResponseType } from "@/domain/revoke/schemas/revoke-history.schema";
import type { GetRevokeHistoriesPayload } from "@/domain/revoke/types/revoke-history.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 리소스 회수 이력 목록 조회 훅
 *
 * @param payload - 조회 조건 (page, size, startDate, endDate)
 * @returns React Query 결과
 */
export const useGetRevokeHistories = (
  payload: GetRevokeHistoriesPayload,
): UseQueryResult<CoreListResponse<RevokeHistoryItemResponseType>, Error> => {
  const { revokeHistoryService } = useServices();

  return useQuery({
    queryKey: revokeHistoryKeys.list(payload),
    queryFn: async () => {
      const response = await revokeHistoryService.getList(payload);
      return response.data;
    },
  });
};
