import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크스페이스 멤버 삭제
 */
export const useDeleteWorkspaceMember = (): UseMutationResult<
  unknown,
  Error,
  string[],
  unknown
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: (members: string[]) => {
      return workspaceService.deleteWorkspaceMember(members);
    },
    onSuccess: () => {},
  });
};
