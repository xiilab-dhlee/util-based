import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CheckPasswordPayload } from "@/types/user/user.type";

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
