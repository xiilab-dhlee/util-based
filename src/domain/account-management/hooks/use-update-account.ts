import { type UseMutationResult, useMutation } from "@tanstack/react-query";

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
    mutationFn: (payload: UpdateAccountPayload) => {
      return accountService.updateAccount(payload);
    },
    onSuccess: () => {},
  });
};
