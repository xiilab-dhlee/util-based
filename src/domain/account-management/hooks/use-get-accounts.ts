import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { accountKeys } from "@/domain/account-management/constants/account.key";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import type { GetAccountsPayload } from "@/domain/account-management/types/account.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 사용자 목록 조회
 */
export const useGetAccounts = (
  payload: GetAccountsPayload,
): UseQueryResult<CoreListResponse<AccountListType>, Error> => {
  const { accountService } = useServices();

  return useQuery({
    queryKey: accountKeys.list(payload),
    queryFn: async () => {
      const response = await accountService.getList(payload);
      return response.data;
    },
  });
};
