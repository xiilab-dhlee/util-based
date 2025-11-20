import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CheckPasswordPayload } from "@/domain/user/types/user.type";
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
  const { userService } = useServices();

  return useMutation({
    mutationFn: (payload: CheckPasswordPayload) => {
      return userService.checkPassword(payload);
    },
    onSuccess: () => {},
  });
};
