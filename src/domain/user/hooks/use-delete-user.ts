import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";

/**
 * 사용자 삭제
 */
export const useDeleteUser = (): UseMutationResult<
  unknown,
  Error,
  string[],
  unknown
> => {
  const { userService } = useServices();

  return useMutation({
    mutationFn: (users: string[]) => {
      return userService.deleteUser(users);
    },
    onSuccess: () => {},
  });
};
