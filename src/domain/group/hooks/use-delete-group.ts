import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";

/**
 * 그룹 삭제
 */
export const useDeleteGroup = (): UseMutationResult<
  unknown,
  Error,
  string,
  unknown
> => {
  const { groupService } = useServices();

  return useMutation({
    mutationFn: (groupId: string) => {
      return groupService.deleteGroup(groupId);
    },
    onSuccess: () => {},
  });
};
