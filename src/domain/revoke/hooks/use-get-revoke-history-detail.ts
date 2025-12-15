import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { revokeHistoryKeys } from "@/domain/revoke/constants/revoke-history.key";
import type {
  GetRevokeHistoryDetailPayload,
  RevokeHistoryDetailListResponse,
} from "@/domain/revoke/types/revoke-history.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 회수 이력 상세 조회 훅 (경고/회수 목록)
 *
 * @param id - 리소스 회수 이력 ID
 * @param payload - 조회 조건 (page, size, startDate, endDate, type)
 * @returns React Query 결과
 */
export const useGetRevokeHistoryDetail = (
  id?: string,
  payload?: GetRevokeHistoryDetailPayload,
): UseQueryResult<RevokeHistoryDetailListResponse, Error> => {
  const { revokeHistoryService } = useServices();

  return useQuery({
    queryKey: revokeHistoryKeys.detail(id ?? "", payload),
    queryFn: async () => {
      const response = await revokeHistoryService.getDetail(
        id as string,
        payload,
      );
      return response.data;
    },
    enabled: Boolean(id),
  });
};
