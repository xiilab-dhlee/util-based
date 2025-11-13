import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";

/**
 * 워크스페이스 멤버 삭제
 */
export const useDeleteWorkspaceMember = (): UseMutationResult<
  any,
  Error,
  string[],
  unknown
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: (members: string[]): Promise<any> => {
      return workspaceService.deleteWorkspaceMember(members);
    },
    onSuccess: () => {},
  });
};

