import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateUserPayload } from "@/types/user/user.type";

/**
 * 사용자 정보 수정
 */
export const useUpdateUser = (): UseMutationResult<
  unknown,
  Error,
  UpdateUserPayload,
  unknown
> => {
  const { userService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => {
      return userService.updateUser(payload);
    },
    onSuccess: () => {},
  });
};
