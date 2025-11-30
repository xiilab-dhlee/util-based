import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { accountKeys } from "@/domain/account-management/constants/account.key";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 사용자 삭제
 */
export const useDeleteAccount = (): UseMutationResult<
  unknown,
  Error,
  string[],
  unknown
> => {
  const { accountService } = useServices();

  return useMutation({
    mutationKey: accountKeys.delete(),
    mutationFn: (accounts: string[]) => {
      return accountService.deleteAccount(accounts);
    },
    onSuccess: () => {},
  });
};
