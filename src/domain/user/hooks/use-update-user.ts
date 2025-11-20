import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateUserPayload } from "@/domain/user/types/user.type";
import { useServices } from "@/shared/providers/service-provider";

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
