import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { accountKeys } from "@/domain/account-management/constants/account.key";
import type { UpdateAccountPayload } from "@/domain/account-management/types/account.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 사용자 정보 수정
 */
export const useUpdateAccount = (): UseMutationResult<
  unknown,
  Error,
  UpdateAccountPayload,
  unknown
> => {
  const { accountService } = useServices();

  return useMutation({
    mutationKey: accountKeys.update(),
    mutationFn: (payload: UpdateAccountPayload) => {
      return accountService.updateAccount(payload);
    },
    onSuccess: () => {},
  });
};
