import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { accountKeys } from "@/domain/account-management/constants/account.key";
import type { AccountDetailType } from "@/domain/account-management/schemas/account.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 계정 상세 정보 조회
 */
export const useGetAccountDetail = (
  accountId: string,
): UseQueryResult<AccountDetailType, Error> => {
  const { accountService } = useServices();

  return useQuery({
    queryKey: accountKeys.detail(accountId),
    enabled: Boolean(accountId),
    queryFn: async () => {
      if (!accountId) {
        throw new Error("accountId is required");
      }

      const response = await accountService.getDetail(accountId);
      return response.data;
    },
  });
};
