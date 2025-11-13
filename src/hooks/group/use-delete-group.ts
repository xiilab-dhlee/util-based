import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";

/**
 * 그룹 삭제
 */
export const useDeleteGroup = (): UseMutationResult<any, Error, string, unknown> => {
  const { groupService } = useServices();

  return useMutation({
    mutationFn: (groupId: string): Promise<any> => {
      return groupService.deleteGroup(groupId);
    },
    onSuccess: () => {},
  });
};

