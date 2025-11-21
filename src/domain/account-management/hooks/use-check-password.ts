import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CheckPasswordPayload } from "@/domain/account-management/types/account.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 비밀번호 재확인
 */
export const useCheckPassword = (): UseMutationResult<
  unknown,
  Error,
  CheckPasswordPayload,
  unknown
> => {
  const { accountService } = useServices();

  return useMutation({
    mutationFn: (payload: CheckPasswordPayload) => {
      return accountService.checkPassword(payload);
    },
    onSuccess: () => {},
  });
};
