import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";

/**
 * 사용자 삭제
 */
export const useDeleteUser = (): UseMutationResult<any, Error, string[], unknown> => {
  const { userService } = useServices();

  return useMutation({
    mutationFn: (users: string[]): Promise<any> => {
      return userService.deleteUser(users);
    },
    onSuccess: () => {},
  });
};

