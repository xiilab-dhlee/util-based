import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { accountKeys } from "@/domain/account-management/constants/account.key";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import type { GetPendingAccountsPayload } from "@/domain/account-management/types/account.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 가입 승인 목록 조회
 */
export const useGetPendingAccounts: (
  payload: GetPendingAccountsPayload,
) => UseQueryResult<CoreListResponse<AccountListType>, Error> = (
  payload: GetPendingAccountsPayload,
) => {
  const { accountService } = useServices();

  return useQuery({
    queryKey: accountKeys.pendingList(payload),
    queryFn: async () => {
      const response = await accountService.getPendingList(payload);
      return response.data;
    },
  });
};
